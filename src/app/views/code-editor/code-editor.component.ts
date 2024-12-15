import {Component, OnInit} from '@angular/core';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/python/python';
import 'codemirror/mode/go/go';
import {ServerService} from "../../shared/services/server.service";
import {Language} from "../../../../interface/language.interface";


@Component({
  selector: 'code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements OnInit {
  editor: any;
  selectedLanguage: Language = {type: 'python'};
  result: string | null = null;
  error: string | null = null;
  isLoading: boolean = false;

  constructor(private serverService: ServerService) {
  }

  ngOnInit(): void {
    const textareaElement: HTMLTextAreaElement = document.getElementById('code-editor') as HTMLTextAreaElement;
    // Инициализация CodeMirror
    this.editor = CodeMirror.fromTextArea(textareaElement, {
      mode: this.selectedLanguage.type, // Используем поле 'type' объекта Language
      lineNumbers: true,               // Включаем отображение номеров строк
      lineWrapping: true,              // Автоперенос строк
      theme: 'default',                // Тема для редактора
    });

    // Устанавливаем начальное значение для редактора
    this.editor.setValue(this.selectedLanguage.type === 'python' ? '# Write your Python code here' : '// Write your Go code here');
  }

  switchLanguage(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement) {
      this.selectedLanguage = {type: selectElement.value as 'python' | 'go'};
      this.editor.setOption('mode', this.selectedLanguage.type);   // Меняем режим в CodeMirror
      this.editor.setValue(this.selectedLanguage.type === 'python' ? '# Write your Python code here' : '// Write your Go code here');
      this.result = null;
      this.error = null;
    }
  }

  runCode(): void {
    const code = this.editor.getValue();
    this.isLoading = true;
    this.result = null;
    this.error = null;

    this.serverService.executeCode(this.selectedLanguage, code)
      .subscribe({
        next: (response) => {
          this.result = response.output ?? null;
          this.isLoading = false;
        },
        error: (err) => {
          this.result = err.message;
          this.isLoading = false;
        },
      });
  }
}
