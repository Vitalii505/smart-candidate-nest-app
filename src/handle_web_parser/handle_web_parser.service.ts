import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { getPlatformTypeByURL, getValidLogoCompanySrc } from '../helper/index';
const staticImgUrl = '/static/images/chart-preview.png';

const _removeSpaces = (value: string) => value.replace(/ +/g, " ").trim()

@Injectable()
export class HadleWebParserService {
    constructor() {}

    static isMargeTextHandler(element: Array<any>, $: cheerio.CheerioAPI, isStopParse: boolean) {
        return element?.map((childElement) => {
            const childText = $(childElement).text();
            if (childElement.tagName === 'strong') {
                isStopParse = true;
                return
            };
            if (isStopParse) return;
            if (childText.length > 0) {
                isStopParse = false;
                return `   ${$(childElement).text()}`
            } else return `   ${$(childElement).text()}\n`;
            
        })
    };

    static async isResultAllTextFromPost(data: string | null, typeUrl: string | null): Promise<any> {
        if (data === null) return;
        const $ = cheerio.load(data);
        
        let isStopParse: boolean = false;

        let textDetalisJob = $(typeUrl === "work"
            ? '#job-description'
            : typeUrl === "dou"
                ? '.vacancy-section'
                : '.mb-4')
        .map((index, element) => 
            index < 2 ? this.isMargeTextHandler(element.children, $, isStopParse) : undefined
        ).get().join(" ");
        let userPicImageSrc = $('img').attr('src');
        
        if (typeUrl === "work") {
            let userPicWorkUASrc = $('img')
                .map((index, element) => index === 1 ? element : undefined);
            userPicImageSrc = $(userPicWorkUASrc).attr('src')
        }
        
        if (userPicImageSrc === staticImgUrl) userPicImageSrc = 'https://www.logolynx.com/images/logolynx/26/2651ed332aad0a6eb1e1f75319cd87b4.jpeg';
        if (typeUrl !== "dou") textDetalisJob = _removeSpaces(textDetalisJob)
        let textPositionTitle = $('h1').text();
        textPositionTitle = _removeSpaces(textPositionTitle);
        return {
            srcImage: userPicImageSrc,
            position: textPositionTitle,
            detalis: textDetalisJob
        }
    }

    static convertTextForAnswerAi(position: string, detalis: string) {
        return '\n " <**********************************************************************\n' + 
            `\n************* Position: \n  ${position}` + 
            '\n\n\n' + `************* Vacancy description: \n  ${detalis}\n` +
            '\n**********************************************************************> "\n';
    }


    static async parsePage(url: string) {
        const response = await axios.get(url);
        const typeUrl = getPlatformTypeByURL(url);
        const resultParserObj = await this.isResultAllTextFromPost(response?.data, typeUrl);
        console.log("+++ parsePage ---> resultParserObj 1111 >>>>>>>>>>>>  ", resultParserObj);
        return {
            srcImage: resultParserObj.srcImage?.toString(),
            position: resultParserObj.position?.toString(),
            url: getValidLogoCompanySrc(url?.toString()),
            text: resultParserObj.detalis?.toString(),
            type: typeUrl
        };
    
    }

    static async isResultStaticParse(url: string): Promise<any> {
        const response = await axios.get(url);
        console.log('000.111 ___ ???????????>>> HTML ------> ', response?.data);
        const $ = cheerio.load(response?.data);
        let proposalsWrapper = $(".proposals-wrapper")
        .map((index, element) => 
            index < 2 ? this.isMargeTextHandler(element.children, $, false) : undefined
        ).get().join(" ");
        proposalsWrapper = _removeSpaces(proposalsWrapper)
        proposalsWrapper = _removeSpaces(proposalsWrapper)
        console.log('000.222 ___ ???????????>>> proposalsWrapper ------> ', proposalsWrapper);
        return proposalsWrapper;
    }
}