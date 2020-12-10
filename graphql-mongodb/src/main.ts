import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  GraphQLSchemaBuilderModule,
  GraphQLSchemaFactory,
} from '@nestjs/graphql'
import { printSchema } from 'graphql'
import { AppModule } from './app.module'
import { LessonResolver } from './lesson/lesson.resolver'
import { StudentResolver } from './student/student.resolver'
import { writeFile } from 'fs'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  await generateSchema()
  await app.listen(3000)
}

async function generateSchema() {
  const app = await NestFactory.create(GraphQLSchemaBuilderModule)
  await app.init()

  const gqlSchemaFactory = app.get(GraphQLSchemaFactory)
  const schema = await gqlSchemaFactory.create([
    LessonResolver,
    StudentResolver,
  ])

  writeFile('schema.graphql', printSchema(schema), function (err) {
    if (err) return console.log(err)
  })
}

bootstrap()
