import { Model, ModelCtor } from "sequelize";
import { getColumnType } from "../utils/database";
import { camelToSnake } from "../utils/converts";
import { formatColumn, formatModel, getError } from "../utils/messages";

const checkerName = "dataType";
const key = "sequelize:attributes";

export async function checkDataTypes(model: ModelCtor<Model<any, any>>) {
  const result = Reflect.getMetadata(key, model.prototype) as {
    [key: string]: {
      type: { types: [Object]; key: string };
      defaultValue: any;
      allowNull: boolean;
    };
  };

  for (const column in result) {
    try {
      const columnSnake = camelToSnake(column);
      const typeFromDb = await getColumnType(model.tableName, columnSnake);
      const key = result[column].type.key;

      if (!typeMap[key]) {
        console.log(getError(checkerName, `Key '${key}' not found.`));
      }

      if (!typeMap[key].includes(typeFromDb)) {
        console.log(
          getError(
            checkerName,
            `DataType of field ${formatModel(model.tableName)}/${formatColumn(
              column
            )} is defined incorrectly. Database: ${formatColumn(
              typeFromDb
            )}. Model: ${formatColumn(key)}. Correct type: ${formatColumn(
              getDataType(typeFromDb)
            )}.`
          )
        );
      }
    } catch (error) {
      console.log(getError(checkerName, JSON.stringify(error)));
    }
  }
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
