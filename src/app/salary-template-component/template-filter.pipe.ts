import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'templateFilter', standalone: true })
export class TemplateFilterPipe implements PipeTransform {
  transform(items: any[], search: string): any[] {
    if (!items) return [];
    if (!search) return items;
    return items.filter(tpl => tpl.templateName.toLowerCase().includes(search.toLowerCase()));
  }
}
