import { Model, ModelCtor, Sequelize } from "sequelize";
import { getColumnType } from "../utils/database";
import { camelToSnake } from "../utils/converts";
import { formatColumn, formatModel } from "../utils/messages";
import { Problem } from "../types";

const checkerName = "dataType";
const key = "sequelize:attributes";

export async function checkDataTypes(
  model: ModelCtor<Model<any, any>>,
  sequelize: Sequelize,
): Promise<Problem[]> {
  const problems: Problem[] = [];
  const result = Reflect.getMetadata(key, model.prototype) as {
    [key: string]: {
      type: { types: [Object]; key: string };
      defaultValue: any;
      allowNull: boolean;
    };
  };

  for (const column in result) {
    const columnSnake = camelToSnake(column);
    const typeFromDb = await getColumnType(
      model.tableName,
      columnSnake,
      sequelize,
    );
    const key = result[column].type.key;

    if (!typeFromDb) {
      problems.push({
        checker: checkerName,
        type: "error",
        message: `Column '${model.tableName}/${columnSnake}' not found`,
      });

      continue;
    }

    if (!typeMap[key]) {
      problems.push({
        checker: checkerName,
        type: "error",
        message: `Key '${key}' not found.`,
      });
    }

    if (!typeMap[key].includes(typeFromDb)) {
      problems.push({
        checker: checkerName,
        type: "error",
        message: `DataType of field ${formatModel(model.tableName)}/${formatColumn(
          column,
        )} is defined incorrectly. Database: ${formatColumn(
          typeFromDb,
        )}. Model: ${formatColumn(key)}. Correct type: ${formatColumn(
          getDataType(typeFromDb),
        )}.`,
      });
    }
  }

  return problems;
}

function getDataType(dbType: string) {
  for (const dataType in typeMap) {
    if (typeMap[dataType].includes(dbType)) return dataType;
  }
  return "type not found";
}

const typeMap: Record<string, string[]> = {
  ABSTRACT: [],
  ARRAY: ["ARRAY"],
  BIGINT: ["bigint", "bigserial"],
  BLOB: ["bytea", "bit", "bit varying"],
  BOOLEAN: ["boolean"],
  CHAR: ["char", "character"],
  CIDR: ["cidr"],
  CITEXT: [],
  DATE: ["date", "timestamp without time zone", "timestamp with time zone"],
  DATEONLY: [],
  DECIMAL: ["decimal"],
  DOUBLE: ["double precision"],
  ENUM: ["USER-DEFINED"],
  FLOAT: [],
  GEOGRAPHY: ["USER-DEFINED"],
  GEOMETRY: [],
  HSTORE: [],
  INET: ["inet"],
  INTEGER: ["integer", "serial", "oid"],
  JSON: ["json"],
  JSONB: ["jsonb"],
  MACADDR: ["macaddr", "macaddr8"],
  MEDIUMINT: [],
  NOW: [],
  NUMBER: [],
  RANGE: [],
  REAL: ["real"],
  SMALLINT: ["smallint", "smallserial"],
  STRING: ["varchar", "character varying"],
  TEXT: ["text"],
  TIME: ["time", "time with time zone", "interval"],
  TINYINT: [],
  TSVECTOR: [],
  UUID: ["uuid"],
  UUIDV1: ["uuid"],
  UUIDV4: ["uuid"],
  VIRTUAL: [],
};

//
// Geometry:
// point, line, lseg, box, path, polygon, circle
//
// money ?? bigint
// numeric
//
// pg_lsn, pg_snapshot
//
// Text Search Types:
// tsquery, tsvector
//
// txid_snapshot

// regclass, regcollation, regconfig, regconfig, regnamespace, regoper, regoperator, regproc, regprocedure, regrole, regtype

// Pseudo
// any, anyelement, anyarray, anynonarray, anyenum, anyrange, anymultirange, anycompatible, anycompatiblearray,
// anycompatiblenonarray, anycompatiblerange, anycompatiblemultirange, cstring, internal, language_handler, fdw_handler,
// table_am_handler, index_am_handler, tsm_handler, record, trigger, event_trigger, pg_ddl_command, void, unknown
