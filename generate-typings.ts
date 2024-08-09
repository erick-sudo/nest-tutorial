import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql'],
  path: join(process.cwd(), 'src/gql/graphql.ts'),
  outputAs: 'class',
  // Enable watch mode for the script to automatically generate typings
  // whenever any .graphql file chages
  watch: true,
  // Automatically generate the additional __typename field
  // for every object type.
  emitTypenameField: true,
});
