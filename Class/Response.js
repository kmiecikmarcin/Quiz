module.exports = class Response {
  static returnMessage(contentMessage) {
    return { message: contentMessage };
  }

  static returnError(contentError) {
    return { error: contentError };
  }

  static returnValidationError(contentValidationError) {
    return { validationError: contentValidationError };
  }

  static returnToken(contentToken) {
    return { token: contentToken };
  }

  static returnSchoolSubjects(contentSchoolSubjects) {
    return { schoolSubjects: contentSchoolSubjects };
  }

  static returnChapters(contentChapters) {
    return { chapters: contentChapters };
  }

  static returnTopics(contentTopics) {
    return { topics: contentTopics };
  }

  static returnUsers(contentUsers) {
    return { users: contentUsers };
  }
};
