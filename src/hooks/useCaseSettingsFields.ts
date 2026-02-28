import { useEffect, useRef } from 'react';
import {
  useCountryStore,
  useCalculatorInputStore,
  useTaxResultStore,
  useCurrencyStore,
} from '../store';
import {
  TaxCalculator,
  DeductionCalculator,
  IncomeTaxCalculator,
  ConsumptionTaxCalculator,
} from '../domain/taxes';
import { convertCurrency } from '../utils/currencyConversion';

const taxCalculator = new TaxCalculator(
  new DeductionCalculator(),
  new IncomeTaxCalculator(),
  new ConsumptionTaxCalculator()
);

export function useCaseSettingsFields() {
  const selectedCountry = useCountryStore((state) => state.selectedCountry);
  const {
    gross,
    childrenCount,
    isMarried,
    setGross,
    setChildrenCount,
    setIsMarried,
    reset,
  } = useCalculatorInputStore();
  const { setResult, clearResult } = useTaxResultStore();
  const { baseCurrency, selectedCurrency, rates } = useCurrencyStore();

  const prevCurrencyRef = useRef(selectedCurrency);

  useEffect(() => {
    const prevCurrency = prevCurrencyRef.current;
    prevCurrencyRef.current = selectedCurrency;

    if (prevCurrency !== selectedCurrency && gross > 0) {
      const convertedGross = convertCurrency(
        gross,
        prevCurrency,
        selectedCurrency,
        rates
      );
      setGross(Math.round(convertedGross * 100) / 100);
    }
  }, [selectedCurrency, gross, rates, setGross]);

  const showMarriedField =
    !!selectedCountry && selectedCountry.deductions.personal.amount > 0;
  const showChildrenField =
    !!selectedCountry && selectedCountry.deductions.children.type !== 'none';

  const handleGrossChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGross(Number(e.target.value) || 0);
  };

  const handleChildrenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChildrenCount(Math.max(0, Number(e.target.value) || 0));
  };

  const handleMarriedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsMarried(e.target.checked);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedCountry) return;

    const grossInBaseCurrency = convertCurrency(
      gross,
      selectedCurrency,
      baseCurrency,
      rates
    );

    const inputs = {
      gross: grossInBaseCurrency,
      childrenCount,
      isMarried,
    };

    const result = taxCalculator.calculate(inputs, selectedCountry);
    setResult(result);
  };

  const handleReset = () => {
    reset();
    clearResult();
  };

  return {
    selectedCountry,
    values: {
      gross,
      childrenCount,
      isMarried,
    },
    visibility: {
      showMarriedField,
      showChildrenField,
    },
    handlers: {
      handleGrossChange,
      handleChildrenChange,
      handleMarriedChange,
      handleSubmit,
      handleReset,
    },
  };
}
