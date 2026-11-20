import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'account.account': {
    defaultView: 'table',
    accentColor: 'primary',
    icon: 'BookText',
    table: {
      columns: ['code', 'name', 'accountType', 'companyId'],
      searchKeys: ['code', 'name'],
    },
    form: {
      title: 'CHART OF ACCOUNTS',
      sections: [
        { title: 'Account', columns: 2, fields: ['code', 'name', 'accountType', 'companyId', 'currencyId'] },
      ],
    },
  },

  'account.journal': {
    defaultView: 'table',
    accentColor: 'primary',
    icon: 'Receipt',
    table: { columns: ['name', 'code', 'type'], searchKeys: ['name', 'code'] },
    form: {
      title: 'FINANCIAL JOURNAL',
      sections: [{ title: 'Journal', columns: 2, fields: ['name', 'code', 'type'] }],
    },
  },

  'account.move': {
    defaultView: 'table',
    accentColor: 'primary',
    icon: 'FileSpreadsheet',
    table: {
      columns: ['name', 'journalId', 'date', 'state', 'companyId'],
      defaultSort: { field: 'date', direction: 'desc' },
      searchKeys: ['name'],
    },
    form: {
      title: 'JOURNAL ENTRY',
      statusBar: { field: 'state' },
      sections: [
        { title: 'Entry', columns: 2, fields: ['name', 'journalId', 'date', 'state', 'companyId'] },
        { title: 'Journal items', columns: 1, fields: ['lineIds'] },
      ],
    },
  },
}
