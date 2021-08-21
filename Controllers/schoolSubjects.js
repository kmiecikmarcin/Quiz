const jwt = require("jsonwebtoken");
const Model = require("../Functions/Others/takeModels");
const checkThatAccountWithEnteredEmailExists = require("../Functions/Users/checkThatAccountWithEnteredEmailExists");
const takeDataAboutSchoolSubjects = require("../Functions/SchoolSubjects/takeDataAboutSchoolSubjects");
const takeDataAboutChaptersAndTopics = require("../Functions/SchoolSubjects/takeDataAboutChaptersAndTopics");
const checkExistsOfSubject = require("../Functions/SchoolSubjects/checkExistsOfSubject");
const checkExistsOfChapter = require("../Functions/SchoolSubjects/checkExistsOfChapter");

const takesAllSubjects = async (req, res) => {
  const response = {
    messages: {
      message: [],
      error: [],
      schoolSubjects: [],
    },
  };

  let dataFromAuth;
  let listOfSchoolSubjects;

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
    const findUserAccount = await checkThatAccountWithEnteredEmailExists(
      Model.Users,
      dataFromAuth.email
    );
    if (findUserAccount !== false) {
      const takeListOfSubjects = await takeDataAboutSchoolSubjects(
        Model.SchoolSubjects
      );
      if (takeListOfSubjects !== false) {
        listOfSchoolSubjects = takeListOfSubjects;
      } else {
        response.messages.error.push("Nie udało się pobrać listy przedmiotów!");
        return res.status(500).send(response);
      }
    } else {
      response.messages.error.push("Użytkownik nie istnieje!");
      return res.status(400).send(response);
    }
  } catch (err) {
    response.messages.error.push(
      "Nie udało się pobrać listy przedmiotów szkolnych!"
    );
    return res.status(500).send(response);
  }

  response.messages.schoolSubjects.push(listOfSchoolSubjects);
  return res.status(200).json(response);
};

const takesAllChapters = async (req, res) => {
  const response = {
    messages: {
      message: [],
      error: [],
      chapters: [],
    },
  };

  let dataFromAuth;
  let listOfChapters;

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
    const findUserAccount = await checkThatAccountWithEnteredEmailExists(
      Model.Users,
      dataFromAuth.email
    );
    if (findUserAccount !== false) {
      const takeListOfChapters = await takeDataAboutChaptersAndTopics(
        Model.Chapters
      );
      if (takeListOfChapters !== false) {
        listOfChapters = takeListOfChapters;
      } else {
        response.messages.error.push("Nie udało się pobrać listy rozdziałów!");
        return res.status(500).send(response);
      }
    } else {
      response.messages.error.push("Użytkownik nie istnieje!");
      return res.status(400).send(response);
    }
  } catch (err) {
    response.messages.error.push("Nie udało się pobrać listy rozdziałów!");
    return res.status(500).send(response);
  }

  response.messages.chapters.push(listOfChapters);
  return res.status(200).json(response);
};

const takesAllTopics = async (req, res) => {
  const response = {
    messages: {
      message: [],
      error: [],
      topics: [],
    },
  };

  let dataFromAuth;
  let listOfTopics;

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
    const findUserAccount = await checkThatAccountWithEnteredEmailExists(
      Model.Users,
      dataFromAuth.email
    );
    if (findUserAccount !== false) {
      const takeListOfTopics = await takeDataAboutChaptersAndTopics(
        Model.Topics
      );
      if (takeListOfTopics !== false) {
        listOfTopics = takeListOfTopics;
      } else {
        response.messages.error.push("Nie udało się pobrać listy tematów!");
        return res.status(500).send(response);
      }
    } else {
      response.messages.error.push("Użytkownik nie istnieje!");
      return res.status(400).send(response);
    }
  } catch (err) {
    response.messages.error.push("Nie udało się pobrać listy tematów!");
    return res.status(500).send(response);
  }

  response.messages.topics.push(listOfTopics);
  return res.status(200).json(response);
};

const createsNewChapter = async (req, res) => {
  const response = {
    messages: {
      message: [],
      error: [],
    },
  };

  const { nameOfSubject, nameOfChapter } = req.body;

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
    if (
      dataFromAuth.name === process.env.S3_TEACHER_PERMISSIONS ||
      dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS
    ) {
      const resultAboutSubjectExist = await checkExistsOfSubject(
        Model.SchoolSubjects,
        nameOfSubject
      );
      if (resultAboutSubjectExist !== false) {
        const resultAboutChapterExist = await checkExistsOfChapter(
          Model.Chapters,
          nameOfChapter
        );
        if (resultAboutChapterExist === false) {
          const resultAboutCreateNewChapter = await Model.Chapters.create({
            name: nameOfChapter,
            SchoolSubjectId: resultAboutSubjectExist.id,
          });
          if (resultAboutCreateNewChapter === null) {
            response.messages.error.push(
              "Nie udało się dodać nowego rodziału! Sprawdź wprowadzone dane!"
            );
            return res.status(400).json(response);
          }
        } else {
          response.messages.error.push(
            "Rozdział o wprowadzonej nazwie już istnieje!"
          );
          return res.status(400).json(response);
        }
      } else {
        response.messages.error.push("Wybrany przedmiot szkolny nie istnieje!");
        return res.status(404).json(response);
      }
    } else {
      response.messages.error.push(
        "Nie posiadasz uprawnień, by móc dodać nowy rodział!"
      );
      return res.status(400).json(response);
    }
  } catch (err) {
    response.messages.message.push(
      "Nie można przeprowadzić procesu dodawania nowego rozdziału!"
    );
    return res.status(500).json(response);
  }

  response.messages.message.push("Pomyślnie dodano nowy rozdział!");
  return res.status(200).json(response);
};

exports.takesAllSubjects = takesAllSubjects;
exports.takesAllChapters = takesAllChapters;
exports.takesAllTopics = takesAllTopics;
exports.createsNewChapter = createsNewChapter;
