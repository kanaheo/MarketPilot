"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { createOrderAction } from "@/app/[locale]/(dashboard)/portfolio/actions";
import {
  createOrderSchema,
  type OrderFormValues,
} from "@/lib/validation/portfolios";
import type {
  OrderFormProps,
  OrderFormSubmission,
} from "@/types/portfolio";

const DEFAULT_SUBMISSION: OrderFormSubmission = {
  message: "",
  status: "idle",
};

export function OrderForm({
  locale,
  messages,
  portfolioId,
}: OrderFormProps) {
  const router = useRouter();
  const [submission, setSubmission] =
    useState<OrderFormSubmission>(DEFAULT_SUBMISSION);
  const {
    clearErrors,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<OrderFormValues>({
    defaultValues: {
      decisionEvidence: "",
      limitPrice: undefined,
      orderType: "MARKET",
      quantity: 1,
      side: "BUY",
      symbol: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(createOrderSchema(messages.validation)),
  });
  const orderType = useWatch({ control, name: "orderType" });
  const orderTypeRegistration = register("orderType");

  function selectMarketOrder(event: ChangeEvent<HTMLInputElement>) {
    orderTypeRegistration.onChange(event);
    setValue("limitPrice", undefined, {
      shouldDirty: true,
      shouldValidate: false,
    });
    clearErrors("limitPrice");
  }

  async function submitOrder(values: OrderFormValues) {
    setSubmission(DEFAULT_SUBMISSION);

    const result = await createOrderAction(locale, portfolioId, values);
    if (!result.ok) {
      setSubmission({
        message: messages.errors[result.reason],
        status: "error",
      });
      return;
    }

    reset({
      decisionEvidence: "",
      limitPrice: undefined,
      orderType: values.orderType,
      quantity: 1,
      side: values.side,
      symbol: "",
    });
    setSubmission({
      message: messages.success,
      status: "success",
    });
    router.refresh();
  }

  return (
    <section className="panel portfolio-detail-panel order-form-panel">
      <div className="portfolio-create-heading">
        <span aria-hidden="true">
          <ClipboardList size={18} strokeWidth={1.9} />
        </span>
        <div>
          <h2>{messages.title}</h2>
          <p>{messages.description}</p>
        </div>
      </div>

      <form
        className="portfolio-create-form"
        noValidate
        onSubmit={handleSubmit(submitOrder)}
      >
        <label>
          <span>{messages.fields.symbol.label}</span>
          <input
            {...register("symbol")}
            aria-invalid={errors.symbol ? "true" : "false"}
            placeholder={messages.fields.symbol.placeholder}
            type="text"
          />
          {errors.symbol ? <small>{errors.symbol.message}</small> : null}
        </label>

        <div className="portfolio-create-fields">
          <div className="cash-transaction-type-group">
            <span>{messages.fields.side.label}</span>
            <label>
              <input {...register("side")} type="radio" value="BUY" />
              {messages.fields.side.options.buy}
            </label>
            <label>
              <input {...register("side")} type="radio" value="SELL" />
              {messages.fields.side.options.sell}
            </label>
            {errors.side ? <small>{errors.side.message}</small> : null}
          </div>

          <div className="cash-transaction-type-group">
            <span>{messages.fields.orderType.label}</span>
            <label>
              <input
                {...orderTypeRegistration}
                onChange={selectMarketOrder}
                type="radio"
                value="MARKET"
              />
              {messages.fields.orderType.options.market}
            </label>
            <label>
              <input
                {...orderTypeRegistration}
                type="radio"
                value="LIMIT"
              />
              {messages.fields.orderType.options.limit}
            </label>
            {errors.orderType ? (
              <small>{errors.orderType.message}</small>
            ) : null}
          </div>
        </div>

        <div className="portfolio-create-fields">
          <label>
            <span>{messages.fields.quantity.label}</span>
            <input
              {...register("quantity", { valueAsNumber: true })}
              aria-invalid={errors.quantity ? "true" : "false"}
              min="0.00000001"
              placeholder={messages.fields.quantity.placeholder}
              step="0.00000001"
              type="number"
            />
            {errors.quantity ? (
              <small>{errors.quantity.message}</small>
            ) : null}
          </label>

          {orderType === "LIMIT" ? (
            <label>
              <span>{messages.fields.limitPrice.label}</span>
              <input
                {...register("limitPrice", {
                  setValueAs: (value: string) =>
                    value === "" ? undefined : Number(value),
                })}
                aria-invalid={errors.limitPrice ? "true" : "false"}
                min="0.0001"
                placeholder={messages.fields.limitPrice.placeholder}
                step="0.0001"
                type="number"
              />
              {errors.limitPrice ? (
                <small>{errors.limitPrice.message}</small>
              ) : null}
            </label>
          ) : null}
        </div>

        <label>
          <span>{messages.fields.decisionEvidence.label}</span>
          <input
            {...register("decisionEvidence")}
            aria-invalid={errors.decisionEvidence ? "true" : "false"}
            placeholder={messages.fields.decisionEvidence.placeholder}
            type="text"
          />
          {errors.decisionEvidence ? (
            <small>{errors.decisionEvidence.message}</small>
          ) : null}
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
