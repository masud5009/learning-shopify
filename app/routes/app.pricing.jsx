import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  List,
  Badge,
  Box,
} from "@shopify/polaris";

export default function PricingPage() {
  return (
    <Page title="Pricing">
      <Layout>
        <Layout.Section>
          <Box paddingBlockEnd="600">
            <BlockStack gap="200">
              <Text as="h1" variant="headingXl">
                Choose your plan
              </Text>
              <Text as="p" tone="subdued">
                Start free, upgrade when you need advanced badge rules.
              </Text>
            </BlockStack>
          </Box>

          <InlineStack gap="500" align="center" blockAlign="stretch">
            <Card>
              <Box padding="500" minWidth="320px">
                <BlockStack gap="500">
                  <InlineStack align="space-between">
                    <Text as="h2" variant="headingLg">Free</Text>
                    <Badge tone="success">Current</Badge>
                  </InlineStack>

                  <BlockStack gap="100">
                    <Text as="p" variant="heading2xl">$0</Text>
                    <Text as="p" tone="subdued">per month</Text>
                  </BlockStack>

                  <List>
                    <List.Item>Basic trust badge</List.Item>
                    <List.Item>3 badge messages</List.Item>
                    <List.Item>Theme app extension</List.Item>
                    <List.Item>Product-specific message</List.Item>
                  </List>

                  <Button disabled fullWidth>
                    Current plan
                  </Button>
                </BlockStack>
              </Box>
            </Card>

            <Card>
              <Box padding="500" minWidth="320px">
                <BlockStack gap="500">
                  <InlineStack align="space-between">
                    <Text as="h2" variant="headingLg">Pro</Text>
                    <Badge tone="attention">Recommended</Badge>
                  </InlineStack>

                  <BlockStack gap="100">
                    <Text as="p" variant="heading2xl">$5</Text>
                    <Text as="p" tone="subdued">per month</Text>
                  </BlockStack>

                  <List>
                    <List.Item>Unlimited badges</List.Item>
                    <List.Item>Price-based rules</List.Item>
                    <List.Item>Product-specific messages</List.Item>
                    <List.Item>Priority support</List.Item>
                  </List>

                  <Button variant="primary" fullWidth>
                    Upgrade to Pro
                  </Button>
                </BlockStack>
              </Box>
            </Card>
          </InlineStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
