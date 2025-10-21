export interface UserSummary {
  name: string;
  avatar?: string;
}

export interface Opportunity {
  opportunityId: number;
  title: string;
  company: string;
  location: string;
  type: string;
  sport: string;
  salary?: string;
  description: string;
  requirements?: string;
  postedByName?: string;    
  postedByAvatar?: string; 
  postedAt?: string;     
}
