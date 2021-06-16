#!/bin/sh

echo "Digite o nome do recurso:"
read resource

echo Generating CRUD to ${resource}

yo secjs ${resource} --path=./${resource}

echo Moving E2E Tests
mv ./${resource}/E2E/${resource} ./test/E2E

echo Moving Dto
mv ./${resource}/Dtos/${resource}Dto.ts ./app/Contracts/Dtos

echo Moving Model
mv ./${resource}/${resource}.ts ./app/Models

echo Moving Api Service
mv ./${resource}/${resource}Service.ts ./app/Services/Api

echo Moving Repository
mv ./${resource}/${resource}Repository.ts ./app/Repositories

echo Moving Controller
mv ./${resource}/${resource}Controller.ts ./app/Http/Controllers

rm -r ./${resource}

echo Finished!
