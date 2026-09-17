import InfiniteScroll from "react-infinite-scroll-component";

interface ScrollProps<T> {
  fetchMore: () => void;
  hasMore: boolean;
  data: T[];
  renderItem: (item: T, k: number) => React.ReactNode;
  className?: string;
}
export default function Scroll<T>({
  fetchMore,
  hasMore,
  data,
  renderItem,
  className,
}: ScrollProps<T>) {
  return (
    <InfiniteScroll
      className={className}
      dataLength={data.length}
      next={fetchMore}
      hasMore={hasMore}
      loader={
        <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
          Loading...
        </p>
      }
      endMessage={
        <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
          All items loaded.
        </p>
      }
    >
      {data.map((item, k) => renderItem(item, k))}
    </InfiniteScroll>
  );
}
