import { Component, OnInit, ViewChild } from '@angular/core'
import crossfilter from 'crossfilter2'
import * as d3 from 'd3'
import * as dc from 'dc'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  p: number = 1
  list: any[] = []
  displayedColumns: string[] = ['Timestamp', 'car-id', 'car-type', 'gate-name']
  dataSource = new MatTableDataSource<any>(this.list)

  @ViewChild(MatPaginator) paginator: MatPaginator

  constructor() {}

  ngOnInit(): void {
    d3.csv('../../../assets/data/Lekagul_slice.csv').then(async (data: any) => {
      let ndx = crossfilter(data)
      let all = ndx.groupAll<any>()
      let carTypeChart = dc.rowChart('#carType')
      let gateNameChart = dc.rowChart('#gateName')
      let pieTypeChart = dc.pieChart('#pieTypeChart')
      let pieGateChart = dc.pieChart('#pieGateChart')
      let visCount = dc.dataCount('.dc-data-count')
      // let visTable = dc.dataTable('.dc-data-table')
      let carTypeDim = ndx.dimension(function (d: any) {
        return d['car-type'] ? d['car-type'] : 0
      })

      let gateNameDim = ndx.dimension(function (d: any) {
        return d['gate-name'] ? d['gate-name'] : 0
      })

      let dateDim = ndx.dimension(function (d: any) {
        return d.Timestamp ? d.Timestamp : 0
      })
      let carTypeGroup = carTypeDim.group()
      let gateNameGroup = gateNameDim.group()
      carTypeChart
        .dimension(carTypeDim)
        .group(carTypeGroup)
        .elasticX(true)
        .data(function (group: any) {
          return group.top(6)
        })
        .ordinalColors([
          'tomato',
          'green',
          'yellowGreen',
          'yellow',
          'cyan',
          'wheat',
        ])
      gateNameChart
        .dimension(gateNameDim)
        .group(gateNameGroup)
        .elasticX(true)
        .data(function (group: any) {
          return group.top(6)
        })
      pieTypeChart
        .dimension(carTypeDim)
        .group(carTypeGroup)
        .cap(4)
        .ordinalColors(['tomato', 'green', 'yellowGreen', 'yellow', 'cyan'])
        .label(function (d) {
          return (
            d.key +
            ' : ' +
            ((d.value / all.reduceCount().value()) * 100).toFixed(2) +
            '%'
          )
        })
        .title(function (d) {
          return 'Total : ' + d.value
        })
        .innerRadius(60)
        .externalRadiusPadding(40)
        .cx(150)
        .legend(
          dc
            .legend()
            .x(320)
            .y(100)
            .itemHeight(20)
            .legendText(function (d: any) {
              return d.name + ' : ' + d.data
            })
            .autoItemWidth(true),
        )

      pieGateChart
        .dimension(gateNameDim)
        .group(gateNameGroup)
        .innerRadius(10)
        .externalRadiusPadding(40)
        .cx(150)
        .cap(5)
        .label(function (d) {
          return ((d.value / all.reduceCount().value()) * 100).toFixed(2) + '%'
        })
        .legend(
          dc
            .legend()
            .x(320)
            .y(100)
            .itemHeight(20)
            .legendText(function (d: any) {
              return d.name + ' : ' + d.data
            })
            .autoItemWidth(true),
        )

      visCount.dimension(ndx).group(all)

      // visTable
      //   .dimension(dateDim)
      //   .group(function (d: any) {
      //     let format = d3.format('02d')
      //     let timeStamp = new Date(d.Timestamp)
      //     return (
      //       timeStamp.getFullYear() + '/' + format(timeStamp.getMonth() + 1)
      //     )
      //   })
      //   .columns(['Timestamp', 'car-id', 'car-type', 'gate-name'])
      data = ndx.allFiltered()
      this.list = data
      this.dataSource = new MatTableDataSource<any>(this.list)
      this.dataSource.paginator = this.paginator

      ndx.onChange((d) => {
        let falseData = ndx.allFiltered()
        this.list = falseData
        this.dataSource = new MatTableDataSource<any>(this.list)
        this.dataSource.paginator = this.paginator
      })
      dc.renderAll()
    })
  }

  resetAll() {
    dc.filterAll()
    dc.renderAll()
  }
}
