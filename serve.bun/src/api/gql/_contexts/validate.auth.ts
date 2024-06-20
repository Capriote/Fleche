import { isNil } from 'lodash';
import * as TypeGql from 'type-graphql';

import { ApolloServerContext } from './types';

export const validateApolloAuth: TypeGql.AuthChecker<ApolloServerContext> = ({
  context,
}) => {
  return !isNil(context.user);
};
