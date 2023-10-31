import { Injectable } from '@nestjs/common';
require('dotenv').config()

import { InjectRepository } from '@nestjs/typeorm';
import { ListApplyEntity } from './entities/list_apply.entity';
import { Repository } from 'typeorm';
import { Configuration, OpenAIApi } from "openai"


@Injectable()
export class ListApplyJobsService {
    private readonly openai: OpenAIApi;
    constructor(
        @InjectRepository(ListApplyEntity)
        private repository: Repository<ListApplyEntity>,

    ) {

        this.openai = new OpenAIApi(
            new Configuration({
                apiKey: process.env.OPENAI_API_KEY
            })
        );
    }

    async generateTextOpenAI(text: string): Promise<any> {
        try {
            const completion = await this.openai
            .createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: text }],
            });
            const result = completion.data.choices[0].message.content
            return result;
            
        } catch (error) {
            const helpText = 'Error OpenAI API:' + '\n'
            error.response ? console.error(`${helpText}:${error.response.status}` +
                '\n', error.response.data)
            : console.log(error);
        }
    }
    
    async allInboxList(): Promise<any> {
        const result = await this.repository.find();
        return result
    }

    async createJobData(position: string, url: string, text: string, answer: string | null, srcImage: string | null, type: string | null, status: string | null): Promise<any> {
        const result = await this.repository.save({
                position: position,
                url: url,
                text: text,
                answer: answer,
                srcImage: srcImage,
                type: type,
                date: new Date(),
                status: status
        });
        return result
    }

    async findByUrl (url: string): Promise<any> {
        return this.repository.findOneBy({
            url,
        });
    }

    async findById (id: number): Promise<any> {
        return this.repository.findOneBy({
            id,
        });
    }

    async createOrUpdateFindInDB (position: string, url: string, text: string, answer: string, srcImage: string | null, type: string | null, status: string | null): Promise<any> {
        const findByOne = await this.findByUrl(url);
        if (findByOne?.url === url) {
            return this.repository.save({
                id: findByOne.id,
                position: findByOne.position,
                url: findByOne.url,
                text: findByOne.text,
                answer: findByOne.answer,
                srcImage: findByOne.srcImage,
                type: findByOne.type,
                status: findByOne.status
            })
        }
        return this.createJobData(position, url, text, answer, srcImage, type, status);
    }

    async createOrUpdateDataAnswer (id: number, answer: string): Promise<any> {
        const findByOne = await this.findById(id);
        if (findByOne?.id === id) {
            return this.repository.save({
                id: findByOne.id,
                position: findByOne.position,
                url: findByOne.url,
                text: findByOne.text,
                answer: answer
            })
        }
        return console.error('***ERROR***: post not found (id does not exist) !');
    }

    async findInDbAndRemoveById(id: number): Promise<any> {
        const findByOne = await this.findById(id);
        
        console.log(" 2 ^^^^^^^^^^^^^^^ findByOne ^^^^^^^^^^^^^^^^^^^ ", findByOne);
        return (findByOne?.id === id)
            ? await this.repository.remove(findByOne)
            : console.error('***ERROR***: ID not found (post does not exist) !');
    }
}
