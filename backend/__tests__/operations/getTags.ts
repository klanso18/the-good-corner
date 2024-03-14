import { gql } from "graphql-tag";

export default gql`
  query GetTags {
    tags {
      id
      name
    }
  }
`;
