exports.logs_table = `
CREATE TABLE IF NOT EXISTS \`home_chat\`.\`logs\` (
  \`log_id\` INT NOT NULL AUTO_INCREMENT,
  \`message\` MEDIUMTEXT NOT NULL,
  \`time\` VARCHAR(45) NOT NULL,
  \`log_level\` VARCHAR(45) NOT NULL,
  PRIMARY KEY (\`log_id\`));
`