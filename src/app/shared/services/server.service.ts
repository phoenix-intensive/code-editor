import {Injectable} from '@angular/core';
import {delay, Observable, of, throwError} from "rxjs";
import {Language} from "../../../../type/language.type";

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  executeCode(language: Language, code: string): Observable<any> {
    const responses = {
      python: {
        success: {status: 'success', output: '15\n'},
        error: {status: 'error', message: 'SyntaxError: unexpected EOF while parsing'},
      },
      go: {
        success: {status: 'success', output: '15\n'},
        error: {status: 'error', message: 'Compilation failed: undefined: add'},
      },
    };

    // Имитация проверки валидности кода
    const isCodeValid =
      (language === 'python' && code.includes('def add') && code.includes('print')) ||
      (language === 'go' && code.includes('func add') && code.includes('fmt.Println'));

    if (isCodeValid) {
      return of(responses[language].success).pipe(delay(2000)); // Успешный результат с задержкой
    } else {
      return throwError(() => responses[language].error).pipe(delay(2000)); // Ошибка с задержкой
    }
  }
}
