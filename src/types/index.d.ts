/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSXElementConstructor, ReactNode } from 'react';

import { BADGE_CRITERIA } from '@/constants';

export type Prettify<T> = {
  [K in keyof T]: T[K];
};

export type TSearchParamsProps = {
  searchParams?: { [key: string]: string | undefined };
};

export type TURLProps = {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
};

export interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;
export type TMeta = {
  limit: number;
  Page: number;
  size: number;
};
export type ResponseSuccessType = {
  data: any;
  meta?: TMeta;
  status: number;
  statusText: string;
  success: boolean;
  headers: any;
  config: any;
};
export type TGenericErrorMessage = {
  path: string | number;
  message: string;
};

export type TGenericErrorResponse = {
  statusCode: number;
  errorName: string;
  errorMessages: TGenericErrorMessage[];
};

export type SideNavItem = {
  title: string;
  path?: string;
  icon?: JSXElementConstructor.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
};

// ============================
// reTypes
export type TChildrenProps = {
  children: ReactNode;
};
export type TChildrenClassProps = {
  children: ReactNode;
  classModifier?: string;
};
