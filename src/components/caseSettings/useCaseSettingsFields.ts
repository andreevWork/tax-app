import { useCountryStore, useCalculatorInputStore } from '../../store';

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
    // TODO: trigger calculation
  };

  const handleReset = () => {
    reset();
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
