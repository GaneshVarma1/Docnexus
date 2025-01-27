import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

export type Doctor = {
  __typename?: 'Doctor';
  city_state: string;
  hco: string;
  name: string;
  npi_number: string;
  num_clinical_trials: number;
  num_payments: number;
  num_publications: number;
  specialty: string;
};

export type FilterGroups = {
  __typename?: 'FilterGroups';
  diagnosis: DiagnosisFilterGroup;
  industryRelationships: IndustryRelationshipFilterGroup;
  keyOpinionLeaders: KeyOpinionLeaderFilterGroup;
  locations: LocationFilterGroup;
  organization: OrganizationFilterGroup;
  patients: PatientFilterGroup;
  provider: ProviderFilterGroup;
};

export type LocationFilterGroup = {
  __typename?: 'LocationFilterGroup';
  cities: Array<string>;
  counties: Array<string>;
  states: Array<string>;
};

export type ProviderFilterGroup = {
  __typename?: 'ProviderFilterGroup';
  gender: Array<string>;
  specialties: Array<string>;
};

export type OrganizationFilterGroup = {
  __typename?: 'OrganizationFilterGroup';
  health_system: Array<string>;
  hospital_name: Array<string>;
  type_2_npi_org: Array<string>;
};

export type IndustryRelationshipFilterGroup = {
  __typename?: 'IndustryRelationshipFilterGroup';
  life_science_firms: Array<string>;
  nature_of_payments: Array<string>;
  products: Array<string>;
  years: Array<string>;
};

export type DiagnosisFilterGroup = {
  __typename?: 'DiagnosisFilterGroup';
  diagnosis_codes: Array<string>;
  prescriptions: Array<string>;
  procedure_codes: Array<string>;
};

export type PatientFilterGroup = {
  __typename?: 'PatientFilterGroup';
  age_groups: Array<string>;
  gender: Array<string>;
};

export type KeyOpinionLeaderFilterGroup = {
  __typename?: 'KeyOpinionLeaderFilterGroup';
  conditions: Array<string>;
  tags: Array<string>;
};

export const GetFiltersDocument = gql`
  query GetFilters {
    filters {
      locations {
        cities
        states
        counties
      }
      provider {
        specialties
        gender
      }
      organization {
        type_2_npi_org
        health_system
        hospital_name
      }
      industryRelationships {
        life_science_firms
        products
        nature_of_payments
        years
      }
      diagnosis {
        diagnosis_codes
        procedure_codes
        prescriptions
      }
      patients {
        gender
        age_groups
      }
      keyOpinionLeaders {
        conditions
        tags
      }
    }
  }
`;

export function useGetFiltersQuery(baseOptions?: Apollo.QueryHookOptions<GetFiltersQuery, GetFiltersQueryVariables>) {
  const options = {...baseOptions};
  return Apollo.useQuery<GetFiltersQuery, GetFiltersQueryVariables>(GetFiltersDocument, options);
}

export type GetFiltersQueryVariables = Exact<{ [key: string]: never; }>;

export type GetFiltersQuery = {
  __typename?: 'Query';
  filters: {
    __typename?: 'FilterGroups';
    locations: {
      __typename?: 'LocationFilterGroup';
      cities: Array<string>;
      states: Array<string>;
      counties: Array<string>;
    };
    provider: {
      __typename?: 'ProviderFilterGroup';
      specialties: Array<string>;
      gender: Array<string>;
    };
    organization: {
      __typename?: 'OrganizationFilterGroup';
      type_2_npi_org: Array<string>;
      health_system: Array<string>;
      hospital_name: Array<string>;
    };
    industryRelationships: {
      __typename?: 'IndustryRelationshipFilterGroup';
      life_science_firms: Array<string>;
      products: Array<string>;
      nature_of_payments: Array<string>;
      years: Array<string>;
    };
    diagnosis: {
      __typename?: 'DiagnosisFilterGroup';
      diagnosis_codes: Array<string>;
      procedure_codes: Array<string>;
      prescriptions: Array<string>;
    };
    patients: {
      __typename?: 'PatientFilterGroup';
      gender: Array<string>;
      age_groups: Array<string>;
    };
    keyOpinionLeaders: {
      __typename?: 'KeyOpinionLeaderFilterGroup';
      conditions: Array<string>;
      tags: Array<string>;
    };
  };
};