"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Landmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { createCashTransactionAction } from "@/app/[locale]/(dashboard)/portfolio/actions";
import {
  createCashTransactionSchema,
  type CashTransactionFormValues,
} from "@/lib/validation/portfolios";
import type {
  CashTransactionFormProps,
  CashTransactionFormSubmission,
} from "@/types/portfolio";

const DEFAULT_SUBMISSION: CashTransactionFormSubmission = {
  message: "",
  status: "idle",
};

export function CashTransactionForm({
  locale,
  messages,
  portfolioId,
}: CashTransactionFormProps) {
  const router = useRouter();
  const [submission, setSubmission] =
    useState<CashTransactionFormSubmission>(DEFAULT_SUBMISSION);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<CashTransactionFormValues>({
    defaultValues: {
      amount: 0,
      note: "",
      transactionType: "DEPOSIT",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(createCashTransactionSchema(messages.validation)),
  });

  async function submitCashTransaction(values: CashTransactionFormValues) {
    setSubmission(DEFAULT_SUBMISSION);

    const result = await createCashTransactionAction(
      locale,
      portfolioId,
      values,
    );
    if (!result.ok) {
      setSubmission({
        message: messages.errors[result.reason],
        status: "error",
      });
      return;
    }

    reset({
      amount: 0,
      note: "",
      transactionType: values.transactionType,
    });
    setSubmission({
      message: messages.success,
      status: "success",
    });
    router.refresh();
  }

  return (
    <section className="panel portfolio-detail-panel cash-transaction-panel">
      <div className="portfolio-create-heading">
        <span aria-hidden="true">
          <Landmark size={18} strokeWidth={1.9} />
        </span>
        <div>
          <h2>{messages.title}</h2>
          <p>{messages.description}</p>
        </div>
      </div>

      <form
        className="portfolio-create-form"
        noValidate
        onSubmit={handleSubmit(submitCashTransaction)}
      >
        <div className="cash-transaction-type-group">
          <span>{messages.fields.transactionType.label}</span>
          <label>
            <input
              {...register("transactionType")}
              type="radio"
              value="DEPOSIT"
            />
            {messages.fields.transactionType.options.deposit}
          </label>
          <label>
            <input
              {...register("transactionType")}
              type="radio"
              value="WITHDRAWAL"
            />
            {messages.fields.transactionType.options.withdrawal}
          </label>
          {errors.transactionType ? (
            <small>{errors.transactionType.message}</small>
          ) : null}
        </div>

        <label>
          <span>{messages.fields.amount.label}</span>
          <input
            {...register("amount", { valueAsNumber: true })}
            aria-invalid={errors.amount ? "true" : "false"}
            min="0.0001"
            placeholder={messages.fields.amount.placeholder}
            step="0.0001"
            type="number"
          />
          {errors.amount ? <small>{errors.amount.message}</small> : null}
        </label>

        <label>
          <span>{messages.fields.note.label}</span>
          <input
            {...register("note")}
            aria-invalid={errors.note ? "true" : "false"}
            placeholder={messages.fields.note.placeholder}
            type="text"
          />
          {errors.note ? <small>{errors.note.message}</small> : null}
        </label>

        <div className="portfolio-create-actions">
          <p
            aria-live="polite"
            className={
              submission.status === "error"
                ? "portfolio-create-message error"
                : "portfolio-create-message"
            }
          >
            {submission.message}
          </p>
          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? messages.submitting : messages.submit}
          </button>
        </div>
      </form>
    </section>
  );
}
