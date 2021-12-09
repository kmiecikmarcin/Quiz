const jwt = require("jsonwebtoken");
const Model = require("../Functions/Others/takeModels");
const checkTheSchoolSubjectExists = require("../Functions/SchoolSubjects/checkTheSchoolSubjectExists");
const createNewSchoolSubject = require("../Functions/SchoolSubjects/createNewSchoolSubject");
const removeSchoolSubjectFromDatabase = require("../Functions/SchoolSubjects/removeSchoolSubjectFromDatabase");

const createSchoolSubject = async (req, res) => {
  const response = {
    messages: {
      message: [],
      error: []
    },
  };

  const { nameOfSubject } = req.body;

  let dataFromAuth;

  try {
    jwt.verify(
      req.token,
      process.env.S3_SECRETKEY,
      async (jwtError, authData) => {
        if (jwtError) {
          response.messages.error.push("Błąd uwierzytelniania!");
          res.status(403).json(response);
        } else {
          dataFromAuth = authData;
        }
      }
    );
  } catch (err) {
    response.messages.error.push(
      "Nie udało się przeprowadzić procesu uwierzytelniania!"
    );
    return res.status(500).send(response);
  }

  try {
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const checkSchoolSubjectExist =
                  await checkTheSchoolSubjectExists(
                    Model.SchoolSubjects,
                    nameOfSubject
                  );
      if (checkSchoolSubjectExist === false) {
        const newSchoolSubject = await createNewSchoolSubject(
          Model.SchoolSubjects,
          nameOfSubject
        );
        if (newSchoolSubject === false) {
          response.messages.error.push("Nie udało się utworzyć nowego przedmiotu szkolnego!");
          return res.status(400).json(response);
        }
      } else {
        response.messages.error.push("Przedmiot szkolny już istnieje!");
        return res.status(400).json(response);
      }
    } else {
      response.messages.error.push(
        "Nie posiadasz uprawnień, by móc dodać nowy rodział!"
      );
      return res.status(400).json(response);
    }
  } catch {
    response.messages.error.push(
      "Nie można przeprowadzić procesu dodawania nowego przedmiotu szkolnego!"
    );
    return res.status(500).json(response);
  }

  response.messages.message.push("Pomyślnie dodano nowy przedmiot szkolny!");
  return res.status(200).json(response);
};

const removeSchoolSubject = async (req, res) => {
  const response = {
    messages: {
      message: [],
      error: []
    },
  };

  const { nameOfSubject } = req.body;

  let dataFromAuth;

  try {
    jwt.verify(
      req.token,
      process.env.S3_SECRETKEY,
      async (jwtError, authData) => {
        if (jwtError) {
          response.messages.error.push("Błąd uwierzytelniania!");
          res.status(403).json(response);
        } else {
          dataFromAuth = authData;
        }
      }
    );
  } catch (err) {
    response.messages.error.push(
      "Nie udało się przeprowadzić procesu uwierzytelniania!"
    );
    return res.status(500).send(response);
  }

  try {
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const checkSchoolSubjectExist =
      await checkTheSchoolSubjectExists(
        Model.SchoolSubjects,
        nameOfSubject
      );
      if (checkSchoolSubjectExist !== false) {
        const deleteSchoolSubject =
        await removeSchoolSubjectFromDatabase(
          res,
          Model.SchoolSubjects,
          Model.Chapters,
          req.body.name_of_school_subject,
          checkSchoolSubjectExist
        );
        if (deleteSchoolSubject === false) {
          response.messages.error.push("Nie udało się usunąć przedmiotu szkolnego!");
          return res.status(400).json(response);
        }
      } else {
        response.messages.error.push("Przedmiot szkolny nie istnieje!");
        return res.status(400).json(response);
      }
    } else {
      response.messages.error.push(
        "Nie posiadasz uprawnień, by móc dodać nowy rodział!"
      );
      return res.status(400).json(response);
    }
  } catch {
    response.messages.message.push(
      "Nie można przeprowadzić procesu usuwania przedmiotu szkolnego!"
    );
    return res.status(500).json(response);
  }

  response.messages.message.push("Pomyślnie usunięto przedmiot szkolny!");
  return res.status(200).json(response);
};

exports.createSchoolSubject = createSchoolSubject;
exports.removeSchoolSubject = removeSchoolSubject;
