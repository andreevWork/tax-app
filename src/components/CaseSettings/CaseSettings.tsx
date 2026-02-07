import shared from '../../styles/shared.module.css';
import styles from './CaseSettings.module.css';
import { useCaseSettingsFields } from './useCaseSettingsFields';

export function CaseSettings() {
  const { selectedCountry, values, visibility, handlers } =
    useCaseSettingsFields();

  return (
    <section className={styles.caseSettingsContainer}>
      {!selectedCountry ? (
        <p className={shared.emptyState}>Select a country to configure</p>
      ) : (
        <form
          onSubmit={handlers.handleSubmit}
          className={styles.caseSettingsForm}
        >
          <div className={styles.caseSettingsItem}>
            <label htmlFor="gross-income">Gross Income</label>
            <input
              id="gross-income"
              type="number"
              min="0"
              value={values.gross || ''}
              onChange={handlers.handleGrossChange}
              placeholder="Enter annual income"
            />
          </div>

          {visibility.showMarriedField && (
            <div className={styles.caseSettingsItem}>
              <label htmlFor="is-married">
                <input
                  id="is-married"
                  type="checkbox"
                  checked={values.isMarried}
                  onChange={handlers.handleMarriedChange}
                />
                Married (joint filing)
              </label>
            </div>
          )}

          {visibility.showChildrenField && (
            <div className={styles.caseSettingsItem}>
              <label htmlFor="children-count">Number of Children</label>
              <input
                id="children-count"
                type="number"
                min="0"
                value={values.childrenCount || ''}
                onChange={handlers.handleChildrenChange}
                placeholder="0"
              />
            </div>
          )}

          <div className={styles.caseSettingsActions}>
            <button type="submit" disabled={values.gross === 0}>
              Calculate
            </button>
            <button type="button" onClick={handlers.handleReset}>
              Reset
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
