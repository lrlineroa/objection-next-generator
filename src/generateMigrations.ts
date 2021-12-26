import { saveGeneratedDataModel } from "@utils/fileSystem";
import { DataModelType } from "src/@types/datamodel";
import { getDataModel } from "./datamodel";
import { generateMigrationFromSQLModel } from "./generator";

let dataModel:DataModelType=getDataModel();


saveGeneratedDataModel('data_model.json', JSON.stringify(dataModel, null, 4));

for(let modelToMigration of dataModel.models){
  generateMigrationFromSQLModel(modelToMigration);
}