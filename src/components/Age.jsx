import { useMemo } from "react";

function calculateAge(birthday) {
  // Parse the birthday string into a Date object
  const birthDate = new Date(birthday);

  // Get the current date
  const today = new Date();

  // Calculate the age
  let age = today.getFullYear() - birthDate.getFullYear();

  // Check if the birthday has already occurred this year
  const hasBirthdayOccurred = today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  // If the birthday hasn't occurred yet this year, subtract 1 from the age
  if (!hasBirthdayOccurred) {
    age--;
  }

  return age;
}

export default function Age() {
  const age = useMemo(() => calculateAge("August 31, 1994"));
  return <>{age}</>
}