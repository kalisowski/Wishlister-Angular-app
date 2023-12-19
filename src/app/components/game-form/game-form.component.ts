import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-game-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputGroupModule,
    InputGroupAddonModule,
    MultiSelectModule,
    CheckboxModule,
    InputTextModule,
    CalendarModule,
    ToggleButtonModule,
  ],
  animations: [],
  templateUrl: './game-form.component.html',
})
export class GameFormComponent implements OnInit {
  protected gameForm!: FormGroup;
  protected tags: string[] = [];
  protected purchaseLinks: string[] = [];
  protected date: Date = new Date();
  protected tomorrow: string = '';

  public ngOnInit(): void {
    const date: Date = new Date();
    this.date.setDate(date.getDate() + 1);
    this.gameForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      platform: new FormControl(null, Validators.required),
      genre: new FormControl(null, Validators.required),
      developer: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
      wishlistPriority: new FormControl(null, Validators.required),
      releaseStatus: new FormControl(false),
      releaseDate: new FormControl(null),
      selectedTags: new FormControl(null),
      purchaseLinks: new FormGroup({
        link: new FormControl(null),
      }),
      personalNotes: new FormControl(null),
    });
  }

  protected onSubmit(): void {
    if (this.gameForm.invalid) {
      return;
    }
    console.log(this.gameForm.value);
  }
}
