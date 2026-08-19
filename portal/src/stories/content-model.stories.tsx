import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Eyebrow, Text } from "@/components/primitives";
import schema from "@/generated/component-schema.json";

/**
 * Content model.
 *
 * Every component's props, read out of the TypeScript rather than written
 * by hand. A component's props are its content type: StoryCard's props are
 * exactly the fields an author fills in to publish a story card, so this is
 * the starting point for the CMS model.
 *
 * Regenerate with `npm run schema`. Because it is derived, the model and
 * the code cannot drift — add a prop and it appears here on the next build.
 */
const meta: Meta = {
  title: "Foundations/Content model",
  parameters: { layout: "fullscreen" },
  tags: ["!autodocs"],
};
export default meta;
type Story = StoryObj;

type Prop = (typeof schema.components)[number]["props"][number];

function Field({ prop }: { prop: Prop }) {
  return (
    <tr className="schema-row">
      <td>
        <Text as="span" size="small" mono className="font-semibold">
          {prop.name}
        </Text>
        {prop.required ? <span className="schema-req">required</span> : null}
      </td>
      <td>
        <span className="schema-kind" data-kind={prop.fieldKind}>
          {prop.fieldKind}
        </span>
      </td>
      <td>
        <Text as="span" size="micro" tone="tertiary" mono>
          {prop.type}
        </Text>
        {prop.options ? (
          <span className="schema-options">
            {prop.options.map((o) => (
              <span key={o} className="schema-option">
                {o}
              </span>
            ))}
          </span>
        ) : null}
      </td>
      <td>
        <Text as="span" size="micro" tone="tertiary" mono>
          {prop.default ?? "—"}
        </Text>
      </td>
      <td>
        <Text as="span" size="micro" tone="secondary">
          {prop.description ?? "—"}
        </Text>
      </td>
    </tr>
  );
}

export const Model: Story = {
  name: "All components",
  render: () => {
    const groups = [...new Set(schema.components.map((c) => c.group))];

    return (
      <div className="px-gutter py-field-tight">
        <div className="mx-auto max-w-wide">
          <Eyebrow className="mb-3.5">Generated from the TypeScript</Eyebrow>
          <Text as="h1" size="display" measure="narrow">
            Content model
          </Text>
          <Text size="lede" tone="secondary" measure="reading" className="mt-4">
            {schema.componentCount} components, {schema.propCount} properties.
            A component&rsquo;s props are its content type — these are the
            fields an author fills in. Derived from the code, so the model and
            the build cannot drift.
          </Text>
          <Text size="micro" tone="tertiary" measure="reading" className="mt-4">
            <strong>fieldKind</strong> is a suggested CMS mapping, not a
            decision. <code>slot</code> means the component renders whatever is
            passed in and probably wants rich text or nested blocks.{" "}
            <code>reference-list</code> means it takes a collection.{" "}
            <code>not-authored</code> means it is wired in code — a callback or
            an element type — and should never reach an author.
          </Text>

          {groups.map((group) => {
            const inGroup = schema.components.filter((c) => c.group === group);
            return (
              <section key={group} className="mt-14">
                <Text as="h2" size="h2" className="section-header">
                  {group}
                </Text>
                <Text
                  size="small"
                  tone="secondary"
                  measure="reading"
                  className="mb-10"
                >
                  {inGroup[0]?.groupNote}
                </Text>

                {inGroup.map((component) => (
                  <div key={component.name} className="schema-block">
                    <Text as="h3" size="h3" className="mb-1">
                      {component.name}
                    </Text>
                    <Text
                      size="micro"
                      tone="tertiary"
                      mono
                      className="mb-3 block"
                    >
                      {component.file}
                    </Text>
                    {component.description ? (
                      <Text
                        size="small"
                        tone="secondary"
                        measure="reading"
                        className="mb-5"
                      >
                        {component.description}
                      </Text>
                    ) : null}

                    {component.props.length === 0 ? (
                      <Text size="small" tone="tertiary">
                        No authored properties.
                      </Text>
                    ) : (
                      <div className="schema-scroll">
                        <table className="schema-table">
                          <thead>
                            <tr>
                              <th>Property</th>
                              <th>Field</th>
                              <th>Type</th>
                              <th>Default</th>
                              <th>Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {component.props.map((prop) => (
                              <Field key={prop.name} prop={prop} />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </section>
            );
          })}
        </div>
      </div>
    );
  },
};
