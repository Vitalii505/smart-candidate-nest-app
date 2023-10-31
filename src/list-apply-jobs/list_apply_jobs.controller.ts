import { Body, Controller, ForbiddenException, Post, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ListApplyJobsService } from './list_apply_jobs.service';
import { HadleWebParserService } from '../handle_web_parser/handle_web_parser.service';
import { CreateUrlApplyDto, UpdateApplyDateDto, GenerateTextDto, GenerateIdDto } from './dto/handler_apply_data.dto';
import { HandleQuestionsService } from '../handle_questions/handle_questions.service';
import { defaultLogoSrc } from '../helper/index';

@Controller('list_apply_jobs')
@ApiTags('list_apply_jobs')
export class ListApplyJobsController {
    constructor(private readonly listApplyJobsService: ListApplyJobsService) { }
    
    // GET request
    @Get('/add-inbox-list')
    async getAllInbox() {
        const result = await this.listApplyJobsService.allInboxList();
        return result
    }

    @Get('/add-update-static')
    async addOrUpdateStatic() {
        const result = await HadleWebParserService.isResultStaticParse('http://localhost:8000/uploads/html/test_inbox.html')
        return result;
    }

    // POST request 
    @Post('/save-url')
    async saveUrl(@Body() createUrlApplyDto: CreateUrlApplyDto ) {
        const isParseObj = await HadleWebParserService.parsePage(createUrlApplyDto.url);
        const saveObj = {
            position: isParseObj.position,
            url: isParseObj.url,
            text: isParseObj.text,
            srcImage: isParseObj?.srcImage ?? defaultLogoSrc,
            type: isParseObj.type ?? 'other-type'
        } 

        try {
            await UpdateApplyDateDto.setUpdateData(saveObj.position, saveObj.url, saveObj.text, '', saveObj?.srcImage, saveObj.type, 'not-apply')
            const result = await this.listApplyJobsService.createOrUpdateFindInDB(
                UpdateApplyDateDto.position, 
                UpdateApplyDateDto.url, 
                UpdateApplyDateDto.text,
                UpdateApplyDateDto.answer,
                UpdateApplyDateDto.srcImage,
                UpdateApplyDateDto.type,
                UpdateApplyDateDto.status
            );
            return result;
        } catch (err) {
            console.error(err);
            throw new ForbiddenException('Помилка при реєстрації !')
        }
        
    };

    @Post('generate_apply_text')
    @ApiOperation({ summary: 'Згенерувати текст за допомогою ChatGPT' })
    async generateText(@Body() generateTextDto: GenerateTextDto): Promise<string> {
        const listCandidateForApply = await this.getAllInbox()
        const getPostById = (id: number, list: []) => {
            let resultPost = {};
            list.forEach((post: any) => {
                if (post.id === id) {
                    resultPost = post;
                } else  resultPost = {};
            });
            return resultPost
        }
        const isAddedVacancyById = getPostById(generateTextDto.id, listCandidateForApply)
        const margeValues = await HandleQuestionsService.setMargeJobsAndThumbnailText(isAddedVacancyById)
        generateTextDto.text = await this.listApplyJobsService.generateTextOpenAI(margeValues);
        // console.log("***_111111111__**** generateTextDto ", generateTextDto)
        try {
            await UpdateApplyDateDto.setUpdateAIAnswerData(generateTextDto.id, generateTextDto.text)
            const result = await this.listApplyJobsService.createOrUpdateDataAnswer(
                UpdateApplyDateDto.id, 
                UpdateApplyDateDto.answer, 
            );
            console.log("***__2222222222_**** result ___ ********>>>>>? ", result)
            return result;
        } catch (err) {
            console.error(err);
            throw new ForbiddenException('Помилка при AI генерації листа !')
        }
    }
    
    @Post('/remove-data-post')
    async deleteApplyPost(@Body() generateIdDto: GenerateIdDto): Promise<number | any> {
        const id = generateIdDto?.id;
        try {
            const removeResult = await this.listApplyJobsService.findInDbAndRemoveById(id);
            return removeResult;
        } catch (err) {
            console.error(err);
            throw new ForbiddenException('Помилка при видаленні поста вакансії з списку !')
        }
    };
}
