
export interface ServicePillar {
  id: number;
  title: string;
  description: string;
  icon: string;
  details: string[];
}

export interface PartnerLab {
  name: string;
  origin: string;
  description: string;
  logo: string;
}

export interface Brand {
  name: string;
  owner: string;
  description: string;
  image: string;
  video?: string;
  website: string;
  instagram: string;
}

export enum ContactType {
  PROFESSIONAL = 'PROFESSIONAL',
  CONSUMER = 'CONSUMER'
}
