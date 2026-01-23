import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { EmployeeORGHierarchyDataModel } from "../models/OrgHierarchyDataModel";
import { getImageApiURL, staticIconsBaseURL } from "../pro_utils/stringConstants";
import type { TreeProps } from "react-d3-tree";

// ✅ Extend react-d3-tree TreeProps to include runtime-supported props
interface ExtendedTreeProps extends TreeProps {
  onZoom?: (zoom: number) => void;
  onTranslate?: (translate: { x: number; y: number }) => void;
}

const D3Tree = dynamic(() => import("react-d3-tree"), { ssr: false });

// ✅ ForwardRef-compatible dynamic import
const Tree = D3Tree as unknown as React.ForwardRefExoticComponent<
  ExtendedTreeProps & React.RefAttributes<any>
>;
type TreeNode = any;

// ✅ Helper to validate image
const getSafeImageUrl = (url: string, fallback: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => resolve(fallback);
    img.src = url;
  });
};

const SafeSvgImage = ({
  imageURL,
  fallback,
  x,
  y,
  width,
  height,
}: {
  imageURL: string;
  fallback: string;
  x: number;
  y: number;
  width: number;
  height: number;
}) => {
  const [imgSrc, setImgSrc] = useState(fallback);

  useEffect(() => {
    let isMounted = true;
    getSafeImageUrl(imageURL, fallback).then((resolved) => {
      if (isMounted) setImgSrc(resolved);
    });
    return () => {
      isMounted = false;
    };
  }, [imageURL, fallback]);

  return (
    <image
      href={imgSrc}
      x={x}
      y={y}
      width={width}
      height={height}
      style={{ pointerEvents: "none" }}
      clipPath="circle(90px at center)"
    />
  );
};

const OrganizationTree = ({
  employeeHerarichy,
}: {
  employeeHerarichy: EmployeeORGHierarchyDataModel[];
}) => {
  const treeContainer = useRef<HTMLDivElement>(null);
  const treeRef = useRef<any>(null); // ✅ store reference to Tree instance

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [rawTreeData, setRawTreeData] = useState<any | null>(null);
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [zoom, setZoom] = useState(0.8); // ✅ controlled zoom

  // Convert API data
  const convertToTreeNode = (employee: any, path: string): TreeNode => {
    const isCollapsed = employee.collapsed ?? true;
    return {
      name: employee.name,
      emp_id: employee.emp_id,
      profile_pic: employee.profile_pic,
      leap_client_designations: employee.leap_client_designations,
      leap_client_departments: employee.leap_client_departments,
      nodePath: path,
      collapsed: isCollapsed,
      bg_color: employee.bg_color,
      hasChildren: employee.hasChildren,
      children:
        isCollapsed || !employee.children
          ? []
          : employee.children.map((child: any, idx: number) =>
              convertToTreeNode(child, `${path}.${idx}`)
            ),
    };
  };

  const findNodeByPath = (node: TreeNode, pathParts: string[]): TreeNode => {
    let current = node;
    for (const idx of pathParts) {
      if (!current.children || !current.children[parseInt(idx, 10)]) break;
      current = current.children[parseInt(idx, 10)];
    }
    return current;
  };

  useEffect(() => {
    if (treeContainer.current) {
      const { width, height } = treeContainer.current.getBoundingClientRect();
      setDimensions({ width, height });
    }

    if (employeeHerarichy && employeeHerarichy.length > 0) {
      const root = structuredClone(employeeHerarichy[0]);

      root.collapsed = false;
      root.bg_color = "#f8d7d8";
      root.children?.forEach((child: any) => {
        child.collapsed = true;
        child.bg_color = "#c5f4c8";
        child.hasChildren = (child.children?.length ?? 0) > 0;
        child.children?.forEach((g: any) => {
          g.bg_color = "#fafcba";
          g.collapsed = true;
          g.hasChildren = (g.children?.length ?? 0) > 0;
          g.children?.forEach((greatgrand: any) => {
            greatgrand.bg_color = "#f8f3d7";
          });
        });
      });

      setRawTreeData(root);
      setTreeData(convertToTreeNode(root, "0"));
    }
  }, [employeeHerarichy]);

  const handleNodeClick = (nodeDatum: TreeNode) => {
    if (!nodeDatum.nodePath) return;
    const pathParts = nodeDatum.nodePath.split(".");
    const targetIndex = parseInt(pathParts[pathParts.length - 1], 10);
    const parentPath = pathParts.slice(1, -1);

    const updatedRaw = structuredClone(rawTreeData);
    const parentNode =
      parentPath.length === 0 ? updatedRaw : findNodeByPath(updatedRaw, parentPath);

    if (parentNode.children) {
      const clickedNode = parentNode.children[targetIndex];
      const willExpand = clickedNode.collapsed;

      parentNode.children.forEach((child: TreeNode) => (child.collapsed = true));
      clickedNode.collapsed = !willExpand;
    }

    setRawTreeData(updatedRaw);
    setTreeData(convertToTreeNode(updatedRaw, "0")); // ✅ don’t reset key, zoom stays same
  };

  const truncateText = (str: string, maxLen: number) =>
    str?.length > maxLen ? str.slice(0, maxLen) + "…" : str;

  const renderCustomNode = ({ nodeDatum }: any) => {
    const imageURL = nodeDatum?.profile_pic
      ? getImageApiURL + "/uploads/" + nodeDatum.profile_pic
      : staticIconsBaseURL + "/images/user/user.png";
    const fallback = staticIconsBaseURL + "/images/user/user.png";

    return (
      <g onClick={() => handleNodeClick(nodeDatum)} style={{ cursor: "pointer" }}>
        <rect
          width="280"
          height="100"
          x={-140}
          y={-50}
          rx={30}
          fill={nodeDatum.bg_color || "#ff0000"}
          stroke="#9f9f9f"
          strokeWidth={1}
        />

        <SafeSvgImage
          imageURL={imageURL}
          fallback={fallback}
          x={-180}
          y={-40}
          width={70}
          height={70}
        />
<text x={0} y={-20} textAnchor="middle" fill="#000" className="orgchart-name">
          {truncateText(nodeDatum.name, 20)}
        </text>

        <text x={0} y={0} textAnchor="middle" className="emp_id_box">
          Employee ID:{" "}
          <tspan className="emp_id_text">
            {nodeDatum.emp_id?.length > 0 ? nodeDatum.emp_id : "--"}
          </tspan>
        </text>

        <text x={0} y={18} textAnchor="middle" className="department_box">
          Department:{" "}
          <tspan className="department_text">
            {nodeDatum?.leap_client_departments?.department_name ?? "--"}
          </tspan>
        </text>

        <text x={0} y={35} textAnchor="middle" className="designation_box">
          Designation:{" "}
          <tspan className="designation_text">
            {nodeDatum?.leap_client_designations?.designation_name
              ? truncateText(nodeDatum.leap_client_designations.designation_name, 20)
              : "--"}
          </tspan>
        </text>
      </g>
    );
  };

  return (
    <div style={{ width: "100%", height: "100vh" }} ref={treeContainer}>
      {treeData && (
        <Tree
          ref={treeRef}
          data={[treeData!]}
          zoom={zoom}
          onZoom={(z: number) => setZoom(z)} // ✅ preserve zoom
          zoomable
          orientation="horizontal"
          translate={{ x: dimensions.width / 6, y: dimensions.height / 3 }}
          pathFunc="step"
          nodeSize={{ x: 380, y: 130 }}
          collapsible={false}
          renderCustomNodeElement={renderCustomNode}
        />
      )}
    </div>
  );
};

export default OrganizationTree;
