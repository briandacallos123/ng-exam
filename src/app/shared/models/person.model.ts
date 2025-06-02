export type personType = {
  id: number;
  name: string;
  team: string;
  salary: string;
  hobbies?: {
    title: string;
    schedule: string;
    monthlyBudget: string;
  };
};
