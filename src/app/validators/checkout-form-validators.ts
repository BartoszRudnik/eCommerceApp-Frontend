import { FormControl, ValidationErrors } from "@angular/forms";

export class CheckoutFormValidators {

    static notOnlyWhitespace(control: FormControl) : ValidationErrors | null{

        if((control.value != null) && (control.value.trim().length === 0)){

            return {'notOnlyWhitespace': true};

        }
        else{

            return null;

        }

    }

    static charAndWhitespace(control: FormControl) : ValidationErrors | null {

        let checkValue : string = control.value;

        if(checkValue.match('^[a-zA-z]{1}[a-z]+$')){

            return null;

        }
        else{

            return {'charAndWhitespace': true} 

        }

    }

    static polishZipCode(control: FormControl) : ValidationErrors | null {

        let checkValue : string = control.value;
        
        if(checkValue.match('[0-9]{2}[-][0-9]{3}')){

            return null;

        }
        else{

            return {'polishZipCode': true};

        }

    }

}
