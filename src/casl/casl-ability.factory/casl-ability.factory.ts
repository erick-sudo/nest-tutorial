import { AbilityClass, InferSubjects } from '@casl/ability';
import { Article } from 'src/articles/article.entity';
import { User } from 'src/decorators/user.decorator';

type Subjects = InferSubjects<typeof Article | typeof User> | 'all';

// export type AppAbility = AbilityClass<[Action, Subjects]>

export class CaslAbilityFactory {}
