import { ApiProperty } from "@nestjs/swagger";

export class CreateUrlApplyDto { 
    @ApiProperty({ example: 'https://djinni.co/jobs/576717-fullstack-developer', description: 'Посилання на оголошення з Djinni' })
    url: string;
}

export class UpdateApplyDateDto { 
    static position: string;
    static url: string;
    static text: string;
    static answer: string | null;
    static id: number;
    static srcImage: string | null;

    static type: string | null;
    static date: Date | null;
    static status: string | null;
    static async setUpdateData(position: string, url: string, text: string, answer: string | null, srcImage: string, type: string, status: string) {
        try {
            this.position = position;
            this.url = url;
            this.text = text;
            this.answer = answer;
            this.srcImage = srcImage;
            this.type = type;
            this.status = status;
            return true
        } catch (e) {
            throw new Error('updateApplyDto method not implemented.');
        }
        
    }
    static async setUpdateAIAnswerData(id: number, answer: string) {
        try {
            this.id = id;
            this.answer = answer;
            return true
        } catch (e) {
            throw new Error('updateApplyDto ("answer") method not implemented.');
        }
        
    }
    static async removeItemData(id: number) {
        try {
            id = id;
            return true
        } catch (e) {
            throw new Error('RemoveApplyDataDto ID method not implemented.');
        }
        
    }
    
}

export class GenerateTextDto {
    @ApiProperty({ example: 15, description: 'one apply to job Id !' })
    id: number;
    @ApiProperty({ example: 'Що таке Nest.js та його особливості?', description: 'Розпарсений текст для використання в ChatGPT' })
    text: string;
}

export class GenerateIdDto {
    @ApiProperty({ example: 15, description: 'one apply to job Id !' })
    id: number;
}