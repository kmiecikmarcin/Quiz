const { Sequelize } = require("sequelize");
const ChaptersModel = require("./Chapters");

const model = (sequelize, DataTypes) => {
  const Chapters = ChaptersModel(sequelize, DataTypes);
  const Topics = sequelize.define(
    "Topics",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
        field: "id_topic",
      },
      name: {
        type: DataTypes.STRING(64),
        unique: true,
        allowNull: false,
        field: "name_of_topic",
      },
      toRemove: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        field: "topics_to_remove",
      },
    },
    {
      indexes: [
        { unique: true, fields: ["id_topic"] },
        { unique: true, fields: ["name_of_topic"] },
      ],
    }
  );
  Topics.belongsTo(Chapters);

  Topics.associate = ({ Chapters }) => {
    Topics.belongsTo(Chapters);
  };

  return Topics;
};

module.exports = model;
