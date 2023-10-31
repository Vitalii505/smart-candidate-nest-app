import { Injectable } from '@nestjs/common';
import axios from 'axios';


@Injectable()
export class HandleQuestionsService {
    static async getDataHelperFromOpenAI(): Promise<any> {
        const generatedTextValue = await axios.get('http://localhost:8000/uploads/json_files/userAnswersByType.json')
        return generatedTextValue.data;
    }

    static async setMargeJobsAndThumbnailText(jobObj: any): Promise<string> {
        const dataHelperFromAI = await this.getDataHelperFromOpenAI()
        // console.log('+++ POST handle QustionsService --> static async getDataHelperFromOpenAI() ---> \n ', dataHelperFromAI)
        const dataHelper = {
            thumbnail_to_letter: dataHelperFromAI["thumbnail-to-letter"].textAnswer,
            thumbnail_2_my_apply: dataHelperFromAI["thumbnail-2-my-apply"].textAnswer,
            thumbnail_3_my_apply: dataHelperFromAI["thumbnail-3-my-apply"].textAnswer,
            thumbnail_4_my_apply: dataHelperFromAI["thumbnail-4-my-apply"].textAnswer,
            full_exemple_1: dataHelperFromAI["full-exemple-1"].textAnswer
        }
        const margeValues = dataHelper.thumbnail_to_letter + "\n" + 
            "**********************************************" + "\n\n" +
            "Position: " + jobObj.position + "\n" + jobObj.text + "\n\n" + 
            "**********************************************" + "\n\n" +
            "2)  " + dataHelper.thumbnail_2_my_apply + "\n" + "-  " + dataHelper.full_exemple_1 + "\n" +
            "3) " + dataHelper.thumbnail_3_my_apply + "\n" + dataHelper.thumbnail_4_my_apply + "\n"
        return margeValues;
    }
}
