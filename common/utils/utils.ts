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
