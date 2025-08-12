import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";

import { createNote } from "../../lib/api"; // Adjust the import path as necessary
import { NoteTag, CreateNoteData } from "../../types/note"; // Adjust the import path as necessary

interface NoteFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const allowedTags: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Мінімум 3 символи")
    .max(50, "Максимум 50 символів")
    .required("Обов'язкове поле"),
  content: Yup.string().max(500, "Максимум 500 символів").notRequired(),
  tag: Yup.mixed<NoteTag>()
    .oneOf(allowedTags, "Недійсний тег")
    .required("Оберіть тег"),
});

const initialValues: CreateNoteData = {
  title: "",
  content: "",
  tag: "Todo",
};

const NoteForm: React.FC<NoteFormProps> = ({ onCancel, onSuccess }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateNoteData) => createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onSuccess();
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        mutation.mutate(values, {
          onSettled: () => setSubmitting(false),
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <label htmlFor="title" className={css.label}>
            Заголовок:
          </label>
          <Field id="title" name="title" type="text" className={css.input} />
          <ErrorMessage name="title" component="div" className={css.error} />

          <label htmlFor="content" className={css.label}>
            Вміст:
          </label>
          <Field
            id="content"
            name="content"
            as="textarea"
            rows={5}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="div" className={css.error} />

          <label htmlFor="tag" className={css.label}>
            Тег:
          </label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            {allowedTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </Field>
          <ErrorMessage name="tag" component="div" className={css.error} />

          <div className={css.buttons}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={css.submitButton}
            >
              {isSubmitting ? "Створення..." : "Створити"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className={css.cancelButton}
            >
              Відміна
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
export default NoteForm;
