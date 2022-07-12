import moment from 'moment';

export const getAvatarInitials = (fullName: string) => {
  const names = fullName.split(' ');
  const initials = names.map((name) => name.substring(0, 1).toUpperCase());
  // eg. Mr. John M Doe ==> JD
  if (initials.length === 4) {
    return initials[1] + initials[3];
  }
  if (initials.length === 3) {
    return initials[1] + initials[2];
  }
  return initials.join('');
};

export const ConstructUrlFromQueryParams = (queryParams: any) => {
  if (Object.keys(queryParams).length) {
    const url = `?${Object.keys(queryParams)
      .map((key) => {
        if (!queryParams[key]) return '';
        return `${key}=${queryParams[key]}`;
      })
      .filter((e) => e)
      .join('&')}`;
    return url;
  }
  return '';
};

export const checkNullOrUndefined = (value: any) => value === null || value === undefined;

export const changeNullToUndefined = (value?: string | null) => {
  return checkNullOrUndefined(value?.toString()?.trim()) ? undefined : value?.toString()?.trim();
};

export function toPascalCase(text?: string | null) {
  if (!text) return '';
  const words = text?.toLowerCase().split(' ');
  const finalWord = words?.map((word) => {
    if (word === 'on' || word === 'of' || word === 'from') {
      return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return finalWord?.join(' ');
}

export const getUtcDate = (hour: number = 0, minutes: number = 0) => {
  return moment().utc().hour(hour).minutes(minutes).seconds(0).milliseconds(0);
};
