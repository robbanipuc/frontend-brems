import { useState, useMemo } from 'react';
import clsx from 'clsx';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/20/solid';
import Spinner from './Spinner';
import EmptyState from './EmptyState';
import Pagination from './Pagination';

const Table = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data found',
  emptyDescription,
  sortable = true,
  defaultSort = null,
  onSort,
  selectable = false,
  selectedRows = [],
  onSelectRows,
  onRowClick,
  rowKey = 'id',
  stickyHeader = false,
  className,
  // Pagination props
  pagination = null,
  onPageChange,
}) => {
  const [sortConfig, setSortConfig] = useState(defaultSort);

  // Handle sorting
  const handleSort = (column) => {
    if (!sortable || !column.sortable) return;

    let direction = 'asc';
    if (sortConfig?.key === column.key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const newSortConfig = { key: column.key, direction };
    setSortConfig(newSortConfig);

    if (onSort) {
      onSort(newSortConfig);
    }
  };

  // Sort data locally if no onSort handler
  const sortedData = useMemo(() => {
    if (!sortConfig || onSort) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    });
  }, [data, sortConfig, onSort]);

  // Handle row selection
  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectRows?.(sortedData.map((row) => row[rowKey]));
    } else {
      onSelectRows?.([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      onSelectRows?.([...selectedRows, id]);
    } else {
      onSelectRows?.(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const isAllSelected =
    sortedData.length > 0 && selectedRows.length === sortedData.length;
  const isSomeSelected =
    selectedRows.length > 0 && selectedRows.length < sortedData.length;

  // Render sort icon
  const renderSortIcon = (column) => {
    if (!sortable || !column.sortable) return null;

    if (sortConfig?.key === column.key) {
      return sortConfig.direction === 'asc' ? (
        <ChevronUpIcon className="w-4 h-4" />
      ) : (
        <ChevronDownIcon className="w-4 h-4" />
      );
    }
    return <ChevronUpDownIcon className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className={clsx('overflow-hidden rounded-lg border border-gray-200', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={clsx('bg-gray-50', stickyHeader && 'sticky top-0 z-10')}>
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={clsx(
                    'px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider',
                    column.sortable && sortable && 'cursor-pointer select-none hover:bg-gray-100',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.headerClassName
                  )}
                  style={{ width: column.width, minWidth: column.minWidth }}
                  onClick={() => handleSort(column)}
                >
                  <div
                    className={clsx(
                      'flex items-center gap-1',
                      column.align === 'center' && 'justify-center',
                      column.align === 'right' && 'justify-end'
                    )}
                  >
                    {column.header}
                    {renderSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-6 py-12 text-center"
                >
                  <Spinner size="lg" className="mx-auto text-primary-600" />
                  <p className="mt-2 text-sm text-gray-500">Loading...</p>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-6 py-12"
                >
                  <EmptyState
                    title={emptyMessage}
                    description={emptyDescription}
                  />
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIndex) => {
                const id = row[rowKey];
                const isSelected = selectedRows.includes(id);

                return (
                  <tr
                    key={id || rowIndex}
                    className={clsx(
                      'transition-colors',
                      isSelected && 'bg-primary-50',
                      onRowClick && 'cursor-pointer hover:bg-gray-50',
                      !isSelected && !onRowClick && 'hover:bg-gray-50'
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td className="w-12 px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(id, e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={clsx(
                          'px-6 py-4 text-sm',
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right',
                          column.className
                        )}
                      >
                        {column.render
                          ? column.render(row[column.key], row, rowIndex)
                          : row[column.key] ?? '-'}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.lastPage}
          totalItems={pagination.total}
          perPage={pagination.perPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default Table;