import { faArrowRight, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import React, { useMemo } from "react";
import { FormattedMessage } from "react-intl";

import { Cell, Row } from "components/SimpleTableComponents";
import { CheckBox } from "components/ui/CheckBox";
import { Switch } from "components/ui/Switch";

import { useBulkEditSelect } from "hooks/services/BulkEdit/BulkEditService";

import { StreamHeaderProps } from "../StreamHeader";
import { HeaderCell } from "../styles";
import styles from "./CatalogTreeTableRow.module.scss";
import { StreamPathSelect } from "./StreamPathSelect";
import { SyncModeSelect } from "./SyncModeSelect";

export const CatalogTreeTableRow: React.FC<StreamHeaderProps> = ({
  stream,
  destName,
  destNamespace,
  onSelectSyncMode,
  onSelectStream,
  availableSyncModes,
  pkType,
  onPrimaryKeyChange,
  onCursorChange,
  primitiveFields,
  cursorType,
  // isRowExpanded,
  fields,
  onExpand,
  changedSelected,
  hasError,
  disabled,
}) => {
  const { primaryKey, cursorField, syncMode, destinationSyncMode } = stream.config ?? {};
  const isStreamEnabled = stream.config?.selected;

  const { defaultCursorField } = stream.stream ?? {};
  const syncSchema = useMemo(
    () => ({
      syncMode,
      destinationSyncMode,
    }),
    [syncMode, destinationSyncMode]
  );

  const [isSelected, selectForBulkEdit] = useBulkEditSelect(stream.id);

  const paths = useMemo(() => primitiveFields.map((field) => field.path), [primitiveFields]);
  const fieldCount = fields?.length ?? 0;
  const onRowClick = fieldCount > 0 ? () => onExpand() : undefined;

  const iconStyle = classnames(styles.icon, {
    [styles.plus]: isStreamEnabled,
    [styles.minus]: !isStreamEnabled,
  });

  const streamHeaderContentStyle = classnames(styles.streamHeaderContent, {
    [styles.enabledChange]: changedSelected && isStreamEnabled,
    [styles.disabledChange]: changedSelected && !isStreamEnabled,
    [styles.selected]: isSelected,
    [styles.error]: hasError,
  });

  const checkboxCellCustomStyle = classnames(styles.checkboxCell, styles.streamRowCheckboxCell);

  return (
    <Row onClick={onRowClick} className={streamHeaderContentStyle}>
      {!disabled && (
        <div className={checkboxCellCustomStyle}>
          {changedSelected && (
            <div>
              {isStreamEnabled ? (
                <FontAwesomeIcon icon={faPlus} size="2x" className={iconStyle} />
              ) : (
                <FontAwesomeIcon icon={faMinus} size="2x" className={iconStyle} />
              )}
            </div>
          )}
          <CheckBox checked={isSelected} onChange={selectForBulkEdit} />
        </div>
      )}
      <Cell flex={0.4} className={styles.streamRowItem}>
        <Switch small checked={stream.config?.selected} onChange={onSelectStream} disabled={disabled} />
      </Cell>
      {/* <Cell>{fieldCount}</Cell> */}
      <HeaderCell ellipsis title={stream.stream?.namespace || ""} className={styles.streamRowItem}>
        {stream.stream?.namespace || <FormattedMessage id="form.noNamespace" />}
      </HeaderCell>
      <HeaderCell ellipsis title={stream.stream?.name || ""} className={styles.streamRowItem}>
        {stream.stream?.name}
      </HeaderCell>
      {/* todo: this is weird, we have a cell nested inside a cell */}
      <Cell>
        {disabled ? (
          <HeaderCell ellipsis title={syncSchema.syncMode}>
            {syncSchema.syncMode}
          </HeaderCell>
        ) : (
          <SyncModeSelect options={availableSyncModes} onChange={onSelectSyncMode} value={syncSchema} />
        )}
      </Cell>
      <HeaderCell className={styles.streamRowItem}>
        {cursorType && (
          <StreamPathSelect
            pathType={cursorType}
            paths={paths}
            path={cursorType === "sourceDefined" ? defaultCursorField : cursorField}
            onPathChange={onCursorChange}
          />
        )}
      </HeaderCell>
      <HeaderCell ellipsis className={styles.streamRowItem}>
        {pkType && (
          <StreamPathSelect
            pathType={pkType}
            paths={paths}
            path={primaryKey}
            isMulti
            onPathChange={onPrimaryKeyChange}
          />
        )}
      </HeaderCell>
      <FontAwesomeIcon icon={faArrowRight} className={styles.arrowCell} />
      <HeaderCell ellipsis title={destNamespace} className={styles.streamRowItem}>
        {destNamespace}
      </HeaderCell>
      <HeaderCell ellipsis title={destName} className={styles.streamRowItem}>
        {destName}
      </HeaderCell>
      <Cell className={styles.streamRowItem}>
        {disabled ? (
          <HeaderCell ellipsis title={syncSchema.destinationSyncMode}>
            {syncSchema.destinationSyncMode}
          </HeaderCell>
        ) : (
          // TODO: Replace with Dropdown/Popout
          <HeaderCell ellipsis title={syncSchema.destinationSyncMode} className={styles.streamRowItem}>
            {syncSchema.destinationSyncMode}
          </HeaderCell>
        )}
      </Cell>
    </Row>
  );
};
