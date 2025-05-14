import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  MoreHorizontal, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Filter 
} from "lucide-react";

interface Column {
  key: string;
  header: string;
  render?: (value: any, record: any) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  caption?: string;
  keyField: string;
  onEdit?: (record: any) => void;
  onDelete?: (record: any) => void;
  onCreate?: () => void;
  isEditable?: boolean;
  isDeletable?: boolean;
  isCreatable?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  title?: string;
  description?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  caption,
  keyField,
  onEdit,
  onDelete,
  onCreate,
  isEditable = true,
  isDeletable = true,
  isCreatable = true,
  pageSize = 10,
  emptyMessage = "No records found",
  title,
  description
}) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);

  // Filtering data based on search term
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(record => {
      return columns.some(column => {
        const value = record[column.key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (typeof value === 'number') {
          return value.toString().includes(searchTerm);
        }
        return false;
      });
    });
  }, [data, searchTerm, columns]);

  // Pagination calculations
  const totalPages = Math.max(Math.ceil(filteredData.length / pageSize), 1);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredData.length);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Handle pagination
  const goToPage = (pageNum: number) => {
    setPage(Math.max(1, Math.min(pageNum, totalPages)));
  };

  // Handle delete
  const handleDelete = (record: any) => {
    setRecordToDelete(record);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (recordToDelete && onDelete) {
      onDelete(recordToDelete);
    }
    setDeleteDialogOpen(false);
    setRecordToDelete(null);
  };

  // Render pagination numbers
  const renderPaginationNumbers = () => {
    const items = [];
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => goToPage(1)}>
            <ChevronsLeft className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => goToPage(i)}
            isActive={page === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      items.push(
        <PaginationItem key="ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => goToPage(totalPages)}>
            <ChevronsRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="space-y-4">
      {/* Table header with search and actions */}
      <div className="flex justify-between items-center">
        <div>
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {isCreatable && onCreate && (
            <Button onClick={onCreate} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add New
            </Button>
          )}
        </div>
      </div>

      {/* Data table */}
      <div className="border rounded-md">
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.key} 
                  className={column.width ? column.width : ''} 
                  style={{ textAlign: column.align || 'left' }}
                >
                  {column.header}
                </TableHead>
              ))}
              {(isEditable || isDeletable) && (
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (isEditable || isDeletable ? 1 : 0)} className="text-center h-24">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((record) => (
                <TableRow key={record[keyField]}>
                  {columns.map((column) => (
                    <TableCell 
                      key={`${record[keyField]}-${column.key}`}
                      style={{ textAlign: column.align || 'left' }}
                    >
                      {column.render ? column.render(record[column.key], record) : record[column.key]}
                    </TableCell>
                  ))}
                  {(isEditable || isDeletable) && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {isEditable && onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(record)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {isDeletable && onDelete && (
                            <DropdownMenuItem 
                              onClick={() => handleDelete(record)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      {filteredData.length > pageSize && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {endIndex} of {filteredData.length} entries
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => goToPage(page - 1)} 
                  isActive={page > 1}
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {renderPaginationNumbers()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => goToPage(page + 1)} 
                  isActive={page < totalPages}
                  className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataTable;