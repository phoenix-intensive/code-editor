import {Injectable} from '@angular/core';
import {delay, Observable, of, throwError} from "rxjs";
import {ServerResponse} from "../../../../interface/serverResponse.interface";
import {Language} from "../../../../interface/language.interface";

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  executeCode(language: Language, code: string): Observable<ServerResponse> {
    const responses = {
      python: {
        success: { status: 'success', output: '15\n' },
        error: { status: 'error', message: 'SyntaxError: unexpected EOF while parsing' },
      },
      go: {
        success: { status: 'success', output: '15\n' },
        error: { status: 'error', message: 'Compilation failed: undefined: add' },
      },
    };

    // Используем language.type вместо языка в строковом виде
    const isCodeValid =
      (language.type === 'python' && code.includes('def add') && code.includes('print')) ||
      (language.type === 'go' && code.includes('func add') && code.includes('fmt.Println'));

    if (isCodeValid) {
      return of(responses[language.type].success).pipe(delay(2000)); // Успешный результат с задержкой
    } else {
      return throwError(() => responses[language.type].error).pipe(delay(2000)); // Ошибка с задержкой
    }
  }
}
