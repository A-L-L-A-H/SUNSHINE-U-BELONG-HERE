// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption, SimpleTable } from './table'

describe('Table', () => {
  it('renders table with container', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header 1</TableHead>
            <TableHead>Header 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell 1</TableCell>
            <TableCell>Cell 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Header 1')).toBeInTheDocument()
    expect(screen.getByText('Cell 1')).toBeInTheDocument()
  })

  it('renders with TableFooter', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Col</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Footer</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )

    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('renders with TableCaption', () => {
    render(
      <Table>
        <TableCaption>Test Caption</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Col</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByText('Test Caption')).toBeInTheDocument()
  })

  it('forwards className to Table', () => {
    render(
      <Table className="custom-table">
        <TableHeader>
          <TableRow>
            <TableHead>Col</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByRole('table')).toHaveClass('custom-table')
  })

  it('renders SimpleTable with headers and rows', () => {
    render(
      <SimpleTable
        headers={['Name', 'Age', 'Role']}
        rows={[
          ['Alice', 30, 'Engineer'],
          ['Bob', 25, 'Designer'],
        ]}
      />
    )

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Engineer')).toBeInTheDocument()
  })

  it('renders SimpleTable with custom className', () => {
    render(
      <SimpleTable
        headers={['Col']}
        rows={[['Data']]}
        className="custom-simple-table"
      />
    )

    const table = screen.getByRole('table')
    const wrapper = table.closest('div')
    expect(wrapper).toHaveClass('custom-simple-table')
  })
})