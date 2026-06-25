"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { createPortfolioAction } from "@/app/[locale]/(dashboard)/portfolio/actions";
import {
  createPortfolioSchema,
  type PortfolioCreateFormValues,
} from "@/lib/validation/portfolios";
import type {
  PortfolioCreateFormProps,
  PortfolioCreateFormSubmission,
} from "@/types/portfolio";

const DEFAULT_SUBMISSION: PortfolioCreateFormSubmission = {
  message: "",
  status: "idle",
};

export function PortfolioCreateForm({
  locale,
  messages,
}: PortfolioCreateFormProps) {
  const router = useRouter();
  const [submission, setSubmission] =
    useState<PortfolioCreateFormSubmission>(DEFAULT_SUBMISSION);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<PortfolioCreateFormValues>({
    defaultValues: {
      baseCurrency: "USD",
      initialCapital: 10000,
      name: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(createPortfolioSchema(messages.validation)),
  });

  async function submitPortfolio(values: PortfolioCreateFormValues) {
    setSubmission(DEFAULT_SUBMISSION);

    const result = await createPortfolioAction(locale, values);
    if (!result.ok) {
      setSubmission({
        message: messages.errors[result.reason],
        status: "error",
      });
      return;
    }

    setSubmission({
      message: messages.success,
      status: "success",
    });
    router.refresh();
  }

  return (
    <section className="panel portfolio-create-panel">
      <div className="portfolio-create-heading">
        <span aria-hidden="true">
          <PlusCircle size={18} strokeWidth={1.9} />
        </span>
        <div>
          <h2>{messages.title}</h2>
          <p>{messages.description}</p>
        </div>
      </div>

      <form
        className="portfolio-create-form"
        noValidate
        onSubmit={handleSubmit(submitPortfolio)}
      >
        <label>
          <span>{messages.fields.name.label}</span>
          <input
            {...register("name")}
            aria-invalid={errors.name ? "true" : "false"}
            placeholder={messages.fields.name.placeholder}
            type="text"
          />
          {errors.name ? <small>{errors.name.message}</small> : null}
        </label>

        <div className="portfolio-create-fields">
          <label>
            <span>{messages.fields.baseCurrency.label}</span>
            <select
              {...register("baseCurrency")}
              aria-invalid={errors.baseCurrency ? "true" : "false"}
            >
              {messages.currencies.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
            {errors.baseCurrency ? (
              <small>{errors.baseCurrency.message}</small>
            ) : null}
          </label>

          <label>
            <span>{messages.fields.initialCapital.label}</span>
            <input
              {...register("initialCapital", { valueAsNumber: true })}
              aria-invalid={errors.initialCapital ? "true" : "false"}
              min="0.0001"
              placeholder={messages.fields.initialCapital.placeholder}
              step="0.0001"
              type="number"
            />
            {errors.initialCapital ? (
              <small>{errors.initialCapital.message}</small>
            ) : null}
          </label>
        </div>

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
