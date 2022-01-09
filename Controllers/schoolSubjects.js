const Model = require("../Functions/Others/takeModels");
const checkThatAccountWithEnteredEmailExists = require("../Functions/Users/checkThatAccountWithEnteredEmailExists");
const takeDataAboutSchoolSubjects = require("../Functions/SchoolSubjects/takeDataAboutSchoolSubjects");
const takeDataAboutChaptersAndTopics = require("../Functions/SchoolSubjects/takeDataAboutChaptersAndTopics");
const checkExistsOfSubject = require("../Functions/SchoolSubjects/checkExistsOfSubject");
const checkExistsOfChapter = require("../Functions/SchoolSubjects/checkExistsOfChapter");
const checkExistsOfTopic = require("../Functions/SchoolSubjects/checkExistsOfTopic");
const checkThatChapterIsAssignToTopic = require("../Functions/SchoolSubjects/checkThatChapterIsAssignToTopic");
const Response = require("../Class/Response");

const takesAllSubjects = async (res, dataFromAuth) => {
  let listOfSchoolSubjects;

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
        return res
          .status(404)
          .send(Response.returnError("Brak przedmiotów szkolnych!"));
      }
    } else {
      return res
        .status(400)
        .send(Response.returnError("Użytkownik nie istnieje!"));
    }
  } catch (err) {
    return res
      .status(500)
      .send(
        Response.returnError(
          "Coś poszło nie tak - nie udało się pobrać listy przedmiotów szkolnych!"
        )
      );
  }

  return res
    .status(200)
    .json(Response.returnSchoolSubjects(listOfSchoolSubjects));
};

const takesAllChapters = async (res, dataFromAuth) => {
  let listOfChapters;

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
        return res.status(404).send(Response.returnError("Brak rodziałów!"));
      }
    } else {
      return res
        .status(400)
        .send(Response.returnError("Użytkownik nie istnieje!"));
    }
  } catch (err) {
    return res
      .status(500)
      .send(
        Response.returnError(
          "Coś poszło nie tak - nie udało się pobrać listy rozdziałów!"
        )
      );
  }

  return res.status(200).json(Response.returnChapters(listOfChapters));
};

const takesAllTopics = async (res, dataFromAuth) => {
  let listOfTopics;

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
        return res.status(404).send(Response.returnError("Brak tematów!"));
      }
    } else {
      return res
        .status(400)
        .send(Response.returnError("Użytkownik nie istnieje!"));
    }
  } catch (err) {
    return res
      .status(500)
      .send(
        Response.returnError(
          "Coś poszło nie tak - nie udało się pobrać listy tematów!"
        )
      );
  }

  return res.status(200).json(Response.returnTopics(listOfTopics));
};

const createsNewChapter = async (req, res, dataFromAuth) => {
  const { nameOfSubject, nameOfChapter } = req.body;

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
            SchoolSubjectId: resultAboutSubjectExist,
          });
          if (resultAboutCreateNewChapter === null) {
            return res
              .status(400)
              .json(
                Response.returnError(
                  "Nie udało się dodać nowego rodziału! Sprawdź wprowadzone dane!"
                )
              );
          }
        } else {
          return res
            .status(400)
            .json(
              Response.returnError(
                "Rozdział o wprowadzonej nazwie już istnieje!"
              )
            );
        }
      } else {
        return res
          .status(404)
          .json(
            Response.returnError("Wybrany przedmiot szkolny nie istnieje!")
          );
      }
    } else {
      return res
        .status(400)
        .json(
          Response.returnError(
            "Nie posiadasz uprawnień, by móc dodać nowy rodział!"
          )
        );
    }
  } catch (err) {
    return res
      .status(500)
      .json(
        Response.returnError(
          "Nie można przeprowadzić procesu dodawania nowego rozdziału!"
        )
      );
  }

  return res
    .status(200)
    .json(Response.returnMessage("Pomyślnie dodano nowy rozdział!"));
};

const createsNewTopic = async (req, res, dataFromAuth) => {
  const { nameOfChapter, nameOfTopic } = req.body;

  try {
    if (
      dataFromAuth.name === process.env.S3_TEACHER_PERMISSIONS ||
      dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS
    ) {
      const resultAboutChapterExist = await checkExistsOfChapter(
        Model.Chapters,
        nameOfChapter
      );
      if (resultAboutChapterExist !== false) {
        const resultAboutTopicExist = await checkExistsOfTopic(
          Model.Topics,
          nameOfTopic
        );
        if (resultAboutTopicExist === false) {
          const resultAboutCreateNewTopic = await Model.Topics.create({
            name: nameOfTopic,
            ChapterId: resultAboutChapterExist,
          });
          if (resultAboutCreateNewTopic === null) {
            return res
              .status(400)
              .json(
                Response.returnError(
                  "Nie udało się dodać nowego tematu! Sprawdź wprowadzone dane!"
                )
              );
          }
        } else {
          return res
            .status(400)
            .json(
              Response.returnError("Temat o wprowadzonej nazwie już istnieje!")
            );
        }
      } else {
        return res
          .status(404)
          .json(Response.returnError("Wybrany rozdział nie istnieje!"));
      }
    } else {
      return res
        .status(400)
        .json(
          Response.returnError(
            "Nie posiadasz uprawnień, by móc dodać nowy temat!"
          )
        );
    }
  } catch (err) {
    return res
      .status(500)
      .json(
        Response.returnError(
          "Nie można przeprowadzić procesu dodawania nowego tematu!"
        )
      );
  }

  return res
    .status(200)
    .json(Response.returnMessage("Pomyślnie dodano nowy temat!"));
};

const removeChapter = async (req, res, dataFromAuth) => {
  const chapter = req.body.nameOfChapter;

  try {
    if (
      dataFromAuth.name === process.env.S3_TEACHER_PERMISSIONS ||
      dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS
    ) {
      const resultAboutChapterExist = await checkExistsOfChapter(
        Model.Chapters,
        chapter
      );
      if (resultAboutChapterExist !== false) {
        const resultAboutAssignChapterToTopic =
          await checkThatChapterIsAssignToTopic(
            Model.Topics,
            resultAboutChapterExist
          );
        if (resultAboutAssignChapterToTopic !== true) {
          const resultAboutUpdateToRemoveField = await Model.Chapters.update(
            { toRemove: true },
            { where: { id: resultAboutChapterExist } }
          );
          if (!resultAboutUpdateToRemoveField.includes(1)) {
            return res
              .status(400)
              .json(
                Response.returnError(
                  "Nie udało się usunąć wybranego rozdziału!"
                )
              );
          }
        } else {
          return res
            .status(400)
            .json(
              Response.returnError(
                "Rozdział posiada przypisany do siebie temat!"
              )
            );
        }
      } else {
        return res
          .status(404)
          .json(Response.returnError("Wybrany rozdział nie istnieje!"));
      }
    } else {
      return res
        .status(400)
        .json(
          Response.returnError(
            "Nie posiadasz uprawnień, by móc usunąć wybrany rozdział!"
          )
        );
    }
  } catch (err) {
    return res
      .status(500)
      .json(
        Response.returnError(
          "Nie można przeprowadzić procesu usuwania rozdziału!"
        )
      );
  }

  return res
    .status(200)
    .json(Response.returnMessage("Pomyślnie usunięto wybrany rozdział!"));
};

const removeTopic = async (req, res, dataFromAuth) => {
  const topic = req.body.nameOfTopic;

  try {
    if (
      dataFromAuth.name === process.env.S3_TEACHER_PERMISSIONS ||
      dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS
    ) {
      const resultAboutTopicExist = await checkExistsOfTopic(
        Model.Topics,
        topic
      );
      if (resultAboutTopicExist !== false) {
        const resultAboutUpdateToRemoveField = await Model.Topics.update(
          { toRemove: true },
          { where: { id: resultAboutTopicExist } }
        );
        if (!resultAboutUpdateToRemoveField.includes(1)) {
          return res
            .status(400)
            .json(
              Response.returnError("Nie udało się usunąć wybranego tematu!")
            );
        }
      } else {
        return res
          .status(404)
          .json(Response.returnError("Wybrany temat nie istnieje!"));
      }
    } else {
      return res
        .status(400)
        .json(
          Response.returnError(
            "Nie posiadasz uprawnień, by móc dodać nowy temat!"
          )
        );
    }
  } catch (err) {
    return res
      .status(500)
      .json(
        Response.returnError("Nie można przeprowadzić procesu usuwania tematu!")
      );
  }

  return res
    .status(200)
    .json(Response.returnMessage("Pomyślnie usunięto wybrany temat!"));
};

exports.takesAllSubjects = takesAllSubjects;
exports.takesAllChapters = takesAllChapters;
exports.takesAllTopics = takesAllTopics;
exports.createsNewChapter = createsNewChapter;
exports.createsNewTopic = createsNewTopic;
exports.removeChapter = removeChapter;
exports.removeTopic = removeTopic;
