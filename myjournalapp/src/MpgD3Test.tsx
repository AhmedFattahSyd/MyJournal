///////////////////////////////////////////////////////////////////////////////////////////////
// MPG Tree View component
// displays list of items in a tree view
///////////////////////////////////////////////////////////////////////////////////////////////
import * as React from "react";
import { Card, List, ListItem, ListItemText } from "@material-ui/core";
import MpgLogger from "./MpgLogger";
import MpgItem, { ItemState } from "./MpgItem";
import MpgGraph from "./MpgGraph";
import { withRouter, RouteComponentProps } from "react-router-dom";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import MpgTheme from "./MpgTheme";
import * as d3 from "d3";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// d3 data
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
type d3Node = {
  id: string;
  group: number;
};

type d3Link = {
  source: string;
  target: string;
  value: number;
};

type Graph = {
  nodes: d3Node[];
  links: d3Link[];
};
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface ITreeProps extends RouteComponentProps {
  toggleSidebarVisibility: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
  mpgGraph: MpgGraph;
  mpgLogger: MpgLogger;
  itemList: MpgItem[];
}
interface ITreeState {
  rootItems: MpgItem[];
  itemList: MpgItem[];
  listOpen: boolean;
  graph: Graph;
}
///////////////////////////////////////////////////////////////////////////////////////////////
// MPG Tree component class
///////////////////////////////////////////////////////////////////////////////////////////////
class MpgTreeCompBase extends React.Component<ITreeProps, ITreeState> {
  ref: any;
  width = 500;
  height = 300;
  graphData: Graph = { nodes: [], links: [] };
  constructor(props: ITreeProps) {
    super(props);

    // this.ref = new SVGSVGElement()
    this.state = {
      rootItems: props.mpgGraph.getRootItems(props.itemList),
      listOpen: false,
      itemList: props.itemList,
      graph: this.loadData()
    };
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // init data from items to d3 data structure
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  loadData = (): Graph => {
    let graphData: Graph = { nodes: [], links: [] };

    let node = { id: "one", group: 1 };
    graphData.nodes.push(node);
    node = { id: "two", group: 1 };
    graphData.nodes.push(node);
    node = { id: "three", group: 1 };
    graphData.nodes.push(node);
    let link = { source: "one", target: "two", value: 1 };
    graphData.links.push(link);
    link = { source: "two", target: "three", value: 1 };
    graphData.links.push(link);
    link = { source: "one", target: "three", value: 1 };
    graphData.links.push(link);
    // this.props.itemList.forEach(item => {
    //   let node: d3Node = { id: item.getId(), group: 1 };
    //   graphData.nodes.push(node);
    //   item.getParentRels().forEach(rel => {
    //     let link = {
    //       source: rel.getItem1().getId(),
    //       target: rel.getItem2().getId(),
    //       value: 1
    //     };
    //     graphData.links.push(link);
    //   });
    // });
    // console.log('graphData: ',graphData);
    return graphData;
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render entry list
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  render = () => {
    return (
      <div style={{ backgroundColor: "black" }}>
        <svg
          className="container"
          ref={(ref: SVGSVGElement) => (this.ref = ref)}
          width={this.width}
          height={this.height}
        ></svg>
      </div>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // component did mount
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  componentDidMount() {
    const context: any = d3.select(this.ref);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const simulation: any = d3
      .forceSimulation()
      .force(
        "link",
        d3.forceLink().id(function(d: any) {
          return d.id;
        })
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(this.width / 2, this.height / 2));

    var link = context
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(this.state.graph.links)
      .enter()
      .append("line")
      .attr("stroke", "yellow")
      .attr("stroke-width", function(d: d3Link) {
        return Math.sqrt(d.value);
      });

    const node = context
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(this.state.graph.nodes)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("fill", "red")
      // .attr("fill", function(d: d3Node) {
      //   return color(d.group.toString());
      // })
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    node.append("text").text("Hello");

    // node.append("title").text(function(d: d3Node) {
    //   return d.id;
    // }).style('fill','black')

    simulation.nodes(this.state.graph.nodes).on("tick", ticked);
    simulation.force("link").links(this.state.graph.links);

    function dragstarted(d: any) {
      if (!d3.event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d: any) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d: any) {
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }

    function ticked() {
      link
        .attr("x1", function(d: any) {
          return d.source.x;
        })
        .attr("y1", function(d: any) {
          return d.source.y;
        })
        .attr("x2", function(d: any) {
          return d.target.x;
        })
        .attr("y2", function(d: any) {
          return d.target.y;
        });

      node
        .attr("cx", function(d: any) {
          return d.x;
        })
        .attr("cy", function(d: any) {
          return d.y;
        });
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////////////
  // component will receive props
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentWillReceiveProps(newProps: ITreeProps) {
    this.setState({
      rootItems: this.props.mpgGraph.getRootItems(newProps.itemList)
    });
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const MpgTreeComp = withRouter(MpgTreeCompBase);
export default MpgTreeComp;
