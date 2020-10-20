import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { resQuestion } from 'src/app/Core/Interfaces/reqQuestion';
import { CloudService } from 'src/app/Core/Services/cloud.service';

@Component({
  selector: 'app-question-editor',
  templateUrl: './question-editor.component.html',
  styleUrls: ['./question-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionEditorComponent implements OnInit {
  questionForm: FormGroup;

  @Input() data: resQuestion;
  @Input() type: string;
  constructor(private fb: FormBuilder, private cloud: CloudService) {}

  ngOnInit(): void {
    this.questionForm = this.fb.group({
      type: ['', Validators.compose([Validators.required])],
      rank: ['', Validators.compose([Validators.required])],
      question: ['', Validators.compose([Validators.required])],
      A: ['', Validators.compose([Validators.required])],
      B: ['', Validators.compose([Validators.required])],
      C: ['', Validators.compose([Validators.required])],
      D: ['', Validators.compose([Validators.required])],
      correctAnswer: ['', Validators.compose([Validators.required])]
    });

    if (this.type === 'Edit') {
      if (this.data === undefined) {
        throw new Error('Data must not empty in Edit mode');
      } else {
        this.bindingData(this.data);
      }
    }

  }

  bindingData(data: resQuestion): void {
    this.questionForm.controls.type.setValue(data.type);
    this.questionForm.controls.rank.setValue(data.rank);
    this.questionForm.controls.question.setValue(data.title);
    this.questionForm.controls.A.setValue(data.answers[0].A);
    this.questionForm.controls.B.setValue(data.answers[0].B);
    this.questionForm.controls.C.setValue(data.answers[0].C);
    this.questionForm.controls.D.setValue(data.answers[0].D);
  }

  onSubmit(): void {
    switch (this.type) {
      case 'Add': {
        this.postQuestion();
        break;
      }
      case 'Edit': {
        console.log('EDIT');
        break;
      }
    }
  }

  postQuestion(): void {
    this.cloud.postQuestion({
      title: this.questionForm.value.question,
      type: this.questionForm.value.type,
      rank: this.questionForm.value.rank,
      answers: [{
        A: this.questionForm.value.A,
        B: this.questionForm.value.B,
        C: this.questionForm.value.C,
        D: this.questionForm.value.D,
        correctAnswer: Number(this.questionForm.value.correctAnswer)
      }]
    }).subscribe({
      next: val => this.handleSuccess(val),
      error: err => this.handleError(err),
    });
  }

  handleSuccess(val): void {
    console.log(val);
  }

  handleError(err): void {
    console.log(err);
  }

}
