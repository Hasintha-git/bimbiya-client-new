import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NicValidationService {


  constructor() { }

  extractBirthdayAndGenderFromNIC(nicNo: any, dob:any): boolean {

    let nicGenderMap = false;

    const NICNo = nicNo;

    let dayText = 0;
    let year = '';
    let month = '';
    let day = 0;
    let gender = '';

    // Obtaining year
    if (NICNo.length === 10) {
      year = '19' + NICNo.substr(0, 2);
      dayText = Number(NICNo.substr(2, 3));
    } else if (NICNo.length === 12) {
      year = NICNo.substr(0, 4);
      dayText = Number(NICNo.substr(4, 3));
    }

    // Obtaining gender
    if (dayText > 500) {
      gender = 'F';
      dayText = dayText - 500;
    } else {
      gender = 'M';
    }
    // Obtaining day and month
    if (dayText >= 1 && dayText < 366) {
      // Month
      if (dayText > 335) {
        day = dayText - 335;
        month = '12';
      } else if (dayText > 305) {
        day = dayText - 305;
        month = '11';
      } else if (dayText > 274) {
        day = dayText - 274;
        month = '10';
      } else if (dayText > 244) {
        day = dayText - 244;
        month = '9';
      } else if (dayText > 213) {
        day = dayText - 213;
        month = '8';
      } else if (dayText > 182) {
        day = dayText - 182;
        month = '7';
      } else if (dayText > 152) {
        day = dayText - 152;
        month = '6';
      } else if (dayText > 121) {
        day = dayText - 121;
        month = '5';
      } else if (dayText > 91) {
        day = dayText - 91;
        month = '4';
      } else if (dayText > 60) {
        day = dayText - 60;
        month = '3';
      } else if (dayText < 32) {
        day = dayText;
        month = '1';
      } else if (dayText > 31) {
        day = dayText - 31;
        month = '2';
      }
    }

    // Check if the extracted dob matches the passed dob
    const extractedDOB = new Date(`${year}-${month}-${day}`);
    const passedDOB = dob;

// Extract year, month, and day components from extractedDOB
    const extractedYear = extractedDOB.getFullYear();
    const extractedMonth = extractedDOB.getMonth();
    const extractedDay = extractedDOB.getDate();

// Extract year, month, and day components from passedDOB
    const passedYear = passedDOB.getFullYear();
    const passedMonth = passedDOB.getMonth();
    const passedDay = passedDOB.getDate();

    if (
      extractedYear === passedYear &&
      extractedMonth === passedMonth &&
      extractedDay === passedDay
    ) {
      nicGenderMap = true;
    }



    return nicGenderMap;
  }

  // getExtractAge(nicNo: any): any{
  //   let timeDiff = Math.abs(Date.now() - new Date(this.extractBirthdayAndGenderFromNIC(nicNo).get('dob')).getTime());
  //   return Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);
  // }

  extractBirthday(nicNo: any): Date | null {

    let nicGenderMap = false;

    const NICNo = nicNo;

    let dayText = 0;
    let year = '';
    let month = '';
    let day = 0;
    let gender = '';

    // Obtaining year
    if (NICNo.length === 10) {
      year = '19' + NICNo.substr(0, 2);
      dayText = Number(NICNo.substr(2, 3));
    } else if (NICNo.length === 12) {
      year = NICNo.substr(0, 4);
      dayText = Number(NICNo.substr(4, 3));
    }

    // Obtaining gender
    if (dayText > 500) {
      gender = 'F';
      dayText = dayText - 500;
    } else {
      gender = 'M';
    }
    // Obtaining day and month
    if (dayText >= 1 && dayText < 366) {
      // Month
      if (dayText > 335) {
        day = dayText - 335;
        month = '12';
      } else if (dayText > 305) {
        day = dayText - 305;
        month = '11';
      } else if (dayText > 274) {
        day = dayText - 274;
        month = '10';
      } else if (dayText > 244) {
        day = dayText - 244;
        month = '9';
      } else if (dayText > 213) {
        day = dayText - 213;
        month = '8';
      } else if (dayText > 182) {
        day = dayText - 182;
        month = '7';
      } else if (dayText > 152) {
        day = dayText - 152;
        month = '6';
      } else if (dayText > 121) {
        day = dayText - 121;
        month = '5';
      } else if (dayText > 91) {
        day = dayText - 91;
        month = '4';
      } else if (dayText > 60) {
        day = dayText - 60;
        month = '3';
      } else if (dayText < 32) {
        day = dayText;
        month = '1';
      } else if (dayText > 31) {
        day = dayText - 31;
        month = '2';
      }
    }

    // Check if the extracted dob matches the passed dob
    const extractedDOB = new Date(`${year}-${month}-${day}`);

    return extractedDOB;
  }
}
