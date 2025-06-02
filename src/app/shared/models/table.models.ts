export type tableHeader = {
  key: string;
  label: string;
  icon?: string;
  iconPosition?: 'start' | 'end';
  hobbies?: {
    [key: string]: string;
  };
};

type hobbies = {
  title: string;
  schedule: string;
  montlyBudget: string;
};
// export type rowType = Omit<tableHeader, 'label'> & {
//   value: string;
// };

export type tableRow = {
  [key: string]: string;
};

// export type TableCell = {
//   key: string;
//   value: string | number | boolean;
//   icon?: string;
//   iconPosition?: 'start' | 'end';
// };

// export type TableCell = {
//   value: string | number | boolean;
//   key: string;
//   icon?: string;
//   iconPosition?: 'start' | 'end';
// };

// export type tableRow = Record<string, TableCell>[];
